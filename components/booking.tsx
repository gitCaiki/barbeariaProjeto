"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Calendar, Clock, User, Phone, Check, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { services, type Service } from "@/components/services"
import { normalizePhone } from "@/lib/phone"
import { cn } from "@/lib/utils"

interface BookingProps {
  selectedServices: Service[]
  onToggleService: (service: Service) => void
  onAddAppointment: (appointment: Appointment) => void
  initialClientPhone?: string
  onClientPhoneChange?: (phone: string) => void
}

export interface Appointment {
  id: string
  services: Service[]
  date: string
  time: string
  clientName: string
  clientPhone: string
  status: "confirmado" | "pendente" | "concluído" | "cancelado"
  createdAt: Date
}

type CreateAppointmentApiResponse = {
  ok?: boolean
  error?: string
  agendamento?: {
    id: string
    startDateTime: string
    status: string
  }
}

type ExistingAppointmentApi = {
  id: string
  startDateTime: string
  endDateTime: string
  status: "agendado" | "em_andamento" | "finalizado" | "cancelado"
}

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] } },
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00"
]

export function Booking({
  selectedServices,
  onToggleService,
  onAddAppointment,
  initialClientPhone = "",
  onClientPhoneChange,
}: BookingProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [existingAppointments, setExistingAppointments] = useState<ExistingAppointmentApi[]>([])

  const setStepAndKeepView = (nextStep: number) => {
    setStep(nextStep)
    requestAnimationFrame(() => {
      document.getElementById("agendar")?.scrollIntoView({ behavior: "auto", block: "start" })
    })
  }

  useEffect(() => {
    if (!initialClientPhone) return
    setClientPhone((prev) => (prev ? prev : initialClientPhone))
  }, [initialClientPhone])

  const handlePickService = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id)
    if (isSelected) return

    selectedServices
      .filter((s) => s.id !== service.id)
      .forEach((s) => onToggleService(s))
    onToggleService(service)
  }

  const handlePickServiceAndContinue = (service: Service) => {
    handlePickService(service)
    setStepAndKeepView(2)
  }

  const totalPrice = selectedServices.reduce((sum, service) => {
    const price = parseFloat(service.price.replace("R$ ", "").replace(",", ".")) || 0
    return sum + price
  }, 0)

  const totalDuration = selectedServices.reduce((sum, service) => {
    const match = service.duration.match(/(\d+)/)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)

  const selectedServiceDuration = useMemo(() => {
    const service = selectedServices[0]
    if (!service) return 0
    const durationParts = service.duration.match(/\d+/g)?.map(Number) ?? []
    return durationParts.length >= 2 ? durationParts[0] * 60 + durationParts[1] : (durationParts[0] ?? 0)
  }, [selectedServices])

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedServiceDuration) return timeSlots

    const now = new Date()
    const todayLocal = new Date()
    const todayIso = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, "0")}-${String(
      todayLocal.getDate()
    ).padStart(2, "0")}`

    const activeAppointments = existingAppointments.filter((appointment) => appointment.status !== "cancelado")

    return timeSlots.filter((time) => {
      const slotStart = new Date(`${selectedDate}T${time}:00`)
      const slotEnd = new Date(slotStart.getTime() + selectedServiceDuration * 60 * 1000)

      // Oculta horários que já passaram hoje (usando horário local)
      if (selectedDate === todayIso && slotEnd <= now) {
        return false
      }

      const hasConflict = activeAppointments.some((appointment) => {
        const existingStart = new Date(appointment.startDateTime)
        const existingEnd = new Date(appointment.endDateTime)
        return existingStart < slotEnd && existingEnd > slotStart
      })

      return !hasConflict
    })
  }, [existingAppointments, selectedDate, selectedServiceDuration])

  useEffect(() => {
    if (step !== 2 || !selectedDate) {
      setExistingAppointments([])
      return
    }

    fetch("/api/agendamentos")
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as null | {
          ok?: boolean
          agendamentos?: ExistingAppointmentApi[]
          error?: string
        }
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Falha ao carregar horários")
        }

        setExistingAppointments(data.agendamentos ?? [])
      })
      .catch(() => {
        setExistingAppointments([])
      })
  }, [selectedDate, step])

  useEffect(() => {
    if (!selectedTime) return
    if (!availableTimeSlots.includes(selectedTime)) {
      setSelectedTime("")
    }
  }, [availableTimeSlots, selectedTime])

  const handleSubmit = () => {
    setBookingError(null)

    if (!selectedServices.length || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      return
    }

    onClientPhoneChange?.(clientPhone)

    const selectedService = selectedServices[0]
    if (!selectedService) return

    const durationParts = selectedService.duration.match(/\d+/g)?.map(Number) ?? []
    const durationInMinutes =
      durationParts.length >= 2 ? durationParts[0] * 60 + durationParts[1] : (durationParts[0] ?? 0)
    if (!durationInMinutes) return

    setIsSubmitting(true)

    const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`)

    fetch("/api/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteNome: clientName,
        clienteTelefone: clientPhone,
        servicoNome: selectedService.name,
        duracao: durationInMinutes,
        startDateTime: startDateTime.toISOString(),
      }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as CreateAppointmentApiResponse | null
        if (!res.ok || !data?.ok || !data.agendamento) {
          throw new Error(data?.error ?? "Não foi possível salvar o agendamento.")
        }

        const start = new Date(data.agendamento.startDateTime)
        const yyyy = start.getFullYear()
        const mm = String(start.getMonth() + 1).padStart(2, "0")
        const dd = String(start.getDate()).padStart(2, "0")
        const hh = String(start.getHours()).padStart(2, "0")
        const min = String(start.getMinutes()).padStart(2, "0")

        const appointment: Appointment = {
          id: data.agendamento.id,
          services: selectedServices,
          date: `${yyyy}-${mm}-${dd}`,
          time: `${hh}:${min}`,
          clientName,
          clientPhone: normalizePhone(clientPhone),
          status: "confirmado",
          createdAt: new Date(),
        }

        onAddAppointment(appointment)
        setShowSuccess(true)

        // Mostra o sucesso primeiro e depois guia o usuário suavemente para "Meus Agendamentos".
        setTimeout(() => {
          document.getElementById("meus-agendamentos")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }, 1200)

        setTimeout(() => {
          setShowSuccess(false)
          setStep(1)
          setSelectedDate("")
          setSelectedTime("")
          setClientName("")
          selectedServices.forEach((s) => onToggleService(s))
        }, 3000)
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Falha no agendamento."
        setBookingError(message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  // Generate next 14 days for date selection
  const generateDates = () => {
    const dates = []
    const today = new Date()
    let offset = 0
    while (dates.length < 14) {
      const date = new Date(today)
      date.setDate(today.getDate() + offset)
      offset += 1

      // Domingo fechado
      if (date.getDay() === 0) {
        continue
      }

      dates.push({
        value: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        number: date.getDate(),
        month: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
      })
    }
    return dates
  }

  const dates = generateDates()

  if (showSuccess) {
    return (
      <section id="agendar" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-card border-primary/30">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-foreground mb-4">
                Agendamento Confirmado!
              </h3>
              <p className="text-muted-foreground mb-2">
                Seu horário foi reservado com sucesso.
              </p>
              <p className="text-foreground font-medium">
                {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })} às {selectedTime}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="agendar" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
            Agendamento
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Reserve seu <span className="text-primary italic">Horário</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha os serviços desejados, selecione a data e horário de sua preferência.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors",
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={cn(
                  "w-16 h-0.5 mx-2",
                  step > s ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden px-1">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Services */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
              <Card className="bg-card border-border shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Scissors className="w-5 h-5 text-primary" />
                  Selecione os Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800/60 bg-card/60 backdrop-blur-sm">
                  <div className="divide-y divide-zinc-800/60">
                    {services.map((service) => {
                      const isSelected = selectedServices.some((s) => s.id === service.id)
                      const initials = service.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p) => p[0])
                        .join("")
                        .toUpperCase()

                      return (
                        <div
                          key={service.id}
                          className={cn(
                            "group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-3 sm:px-4 py-4 transition-colors min-w-0",
                            "hover:bg-zinc-900/30",
                            isSelected && "bg-primary/10"
                          )}
                          onClick={() => handlePickService(service)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-zinc-800/80 text-zinc-100"
                              )}
                            >
                              {isSelected ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <span className="text-xs font-semibold">{initials}</span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-foreground font-medium leading-tight break-words line-clamp-2">
                                {service.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400 mt-1">
                                <span className="text-green-500 font-semibold whitespace-nowrap">
                                  {service.price}
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1 whitespace-nowrap min-w-0">
                                  <Clock className="w-4 h-4" />
                                  <span className="truncate">{service.duration}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end w-full sm:w-auto">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className="px-4 sm:px-5 py-2 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all font-serif w-full sm:w-auto"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePickServiceAndContinue(service)
                              }}
                            >
                              Agendar
                            </motion.button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Step 2: Select Date & Time */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
              <Card className="bg-card border-border shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  Escolha Data e Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Context: Selected Services */}
                <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-primary" />
                      Serviço selecionado
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                      {selectedServices.map(s => s.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-primary text-lg">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
                    <p className="text-xs text-muted-foreground">{totalDuration} min</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-8">
                  <Label className="text-foreground mb-3 block">Data</Label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map((date) => (
                      <button
                        key={date.value}
                        onClick={() => setSelectedDate(date.value)}
                        className={cn(
                          "flex-shrink-0 w-16 py-3 rounded-lg border text-center transition-all",
                          selectedDate === date.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 text-foreground"
                        )}
                      >
                        <p className="text-xs uppercase opacity-80">{date.day}</p>
                        <p className="text-xl font-bold">{date.number}</p>
                        <p className="text-xs uppercase opacity-80">{date.month}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <Label className="text-foreground mb-3 block">Horário</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                          selectedTime === time
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 text-foreground"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {availableTimeSlots.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Não há horários disponíveis para esta data.
                    </p>
                  )}
                </div>

                {bookingError && (
                  <p className="text-sm text-red-400 mb-4">{bookingError}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-foreground"
                    onClick={() => setStepAndKeepView(1)}
                  >
                    Voltar (Serviços)
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setStepAndKeepView(3)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continuar
                  </Button>
                </div>
              </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Step 3: Client Info */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
              <Card className="bg-card border-border shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-border text-foreground"
                      onClick={() => setStepAndKeepView(2)}
                    >
                      Voltar (Data/Horário)
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border text-foreground"
                      onClick={() => setStepAndKeepView(1)}
                    >
                      Serviços
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Digite seu nome"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground">WhatsApp / Telefone</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="(00) 00000-0000"
                        value={clientPhone}
                        onChange={(e) => {
                          const value = e.target.value
                          setClientPhone(value)
                          onClientPhoneChange?.(value)
                        }}
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <h4 className="font-medium text-foreground mb-3">Resumo do Agendamento</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Serviços:</span>
                        <span className="text-foreground">{selectedServices.map(s => s.name).join(", ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="text-foreground">
                          {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Horário:</span>
                        <span className="text-foreground">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="text-foreground font-medium">Total:</span>
                        <span className="text-primary font-bold">
                          R$ {totalPrice.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-border text-foreground"
                      onClick={() => setStepAndKeepView(2)}
                    >
                      Voltar
                    </Button>
                    <Button
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleSubmit}
                      disabled={!clientName || !clientPhone || isSubmitting}
                    >
                      {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
                    </Button>
                  </div>
                </div>
              </CardContent>
              </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
