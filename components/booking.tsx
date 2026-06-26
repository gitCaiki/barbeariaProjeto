"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Calendar, Clock, User, Phone, Check, Scissors, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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
  const [showBlockedModal, setShowBlockedModal] = useState(false)

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
        
        if (res.status === 403) {
          setShowBlockedModal(true)
          throw new Error(data?.error ?? "Agendamento negado.")
        }
        
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

        // Primeiro garante que a confirmação está visível, depois rola para meus agendamentos
        requestAnimationFrame(() => {
          const confirmacaoEl = document.getElementById("agendar")
          if (confirmacaoEl) {
            confirmacaoEl.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        })

        // Rola para meus agendamentos após mostrar a confirmação
        setTimeout(() => {
          document.getElementById("meus-agendamentos")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }, 2000)
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
      <section id="agendar" className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto bg-card border-primary/20 shadow-soft">
            <CardContent className="py-16 md:py-20 text-center relative overflow-hidden">
              {/* Elemento decorativo */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 ring-2 ring-primary/20">
                <Check className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>

              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Sucesso</p>

              <h3 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-4 tracking-wide">
                Agendamento Confirmado
              </h3>

              <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />

              <p className="text-muted-foreground mb-2 font-light">
                Seu horário foi reservado com sucesso.
              </p>
              <p className="text-foreground font-medium text-lg">
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
    <section id="agendar" className="py-24 md:py-32 bg-secondary/30 relative">
      {/* Elemento decorativo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Experiência Premium */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-primary mb-4"
          >
            Agendamento
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6 tracking-wide"
          >
            Experiência <span className="text-primary italic">Premium</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-px bg-primary mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-2xl mx-auto font-light"
          >
            Escolha os serviços desejados, selecione a data e horário de sua preferência.
          </motion.p>
        </div>

        {/* Progress Steps - Minimalista */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16">
          {[
            { num: 1, label: "Serviços" },
            { num: 2, label: "Data" },
            { num: 3, label: "Confirmar" }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 border-2",
                    step >= s.num
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-card border-border text-muted-foreground"
                  )}
                >
                  {step > s.num ? <Check className="w-5 h-5" strokeWidth={2} /> : s.num}
                </div>
                <span className={cn(
                  "text-xs tracking-wide transition-colors duration-300 hidden sm:block",
                  step >= s.num ? "text-primary" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={cn(
                  "w-8 md:w-16 h-px mx-2 md:mx-4 transition-colors duration-300",
                  step > s.num ? "bg-primary" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden px-1">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Services - Cards Estilo Experiência Premium */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="max-w-6xl mx-auto">
                  {/* Header do step */}
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <Scissors className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    <span className="text-lg font-serif font-medium text-foreground">Selecione os Serviços</span>
                  </div>

                  {/* Grid de cards - Estilo Services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={cn(
                          "group relative bg-card rounded-lg p-6 border border-border/50",
                          "hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                        )}
                      >
                        {/* Linha decorativa dourada no topo */}
                        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Conteúdo do card */}
                        <div className="mb-4">
                          <h3 className="text-lg font-serif font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-light line-clamp-2">
                            {service.description}
                          </p>
                        </div>

                        {/* Footer do card */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-serif font-light text-primary">
                              {service.price}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              {service.duration}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePickServiceAndContinue(service)}
                            className="text-primary hover:bg-primary/10 font-medium text-sm"
                          >
                            Agendar
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
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
              <Card className="bg-card border-border/50 shadow-soft overflow-hidden">
                {/* Linha decorativa no topo */}
                <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-foreground font-serif font-medium">
                    <Calendar className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    Escolha Data e Horário
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Context: Selected Services - Estilo refinado */}
                  <div className="mb-8 p-5 bg-secondary/50 rounded-lg border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-foreground text-sm flex items-center gap-2 mb-1">
                        <Scissors className="w-4 h-4 text-primary" strokeWidth={1.5} />
                        Serviço selecionado
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedServices.map(s => s.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-serif text-xl text-primary">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
                      <p className="text-xs text-muted-foreground">{totalDuration} min</p>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-8">
                    <Label className="text-foreground mb-4 block text-sm font-medium">Data</Label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {dates.map((date) => (
                        <button
                          key={date.value}
                          onClick={() => setSelectedDate(date.value)}
                          className={cn(
                            "flex-shrink-0 w-16 py-3 rounded-lg border text-center transition-all duration-300",
                            selectedDate === date.value
                              ? "border-primary bg-primary text-primary-foreground shadow-gold"
                              : "border-border/50 bg-card hover:border-primary/50 text-foreground"
                          )}
                        >
                          <p className="text-[10px] uppercase tracking-wider opacity-70">{date.day}</p>
                          <p className="text-xl font-serif font-light">{date.number}</p>
                          <p className="text-[10px] uppercase tracking-wider opacity-70">{date.month}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="mb-8">
                    <Label className="text-foreground mb-4 block text-sm font-medium">Horário</Label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
                      {availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-2.5 px-3 rounded-md border text-sm font-medium transition-all duration-300",
                            selectedTime === time
                              ? "border-primary bg-primary text-primary-foreground shadow-gold"
                              : "border-border/50 bg-card hover:border-primary/50 text-foreground"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {availableTimeSlots.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-4">
                        Não há horários disponíveis para esta data.
                      </p>
                    )}
                  </div>

                  {bookingError && (
                    <p className="text-sm text-destructive mb-4 bg-destructive/10 p-3 rounded-md">{bookingError}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
                    <Button
                      variant="outline"
                      className="flex-1 border-border/50 text-foreground hover:bg-secondary rounded-md"
                      onClick={() => setStepAndKeepView(1)}
                    >
                      Voltar
                    </Button>
                    <Button
                      className="flex-1 bg-primary text-primary-foreground hover:opacity-90 rounded-md"
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
              <Card className="bg-card border-border/50 shadow-soft overflow-hidden">
                {/* Linha decorativa no topo */}
                <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-foreground font-serif font-medium">
                    <User className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    Seus Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Breadcrumbs de navegação */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <button
                        onClick={() => setStepAndKeepView(1)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Serviços
                      </button>
                      <span className="text-border">/</span>
                      <button
                        onClick={() => setStepAndKeepView(2)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Data e Horário
                      </button>
                      <span className="text-border">/</span>
                      <span className="text-foreground font-medium">Seus Dados</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="name" className="text-foreground text-sm font-medium mb-2 block">Nome Completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                          <Input
                            id="name"
                            placeholder="Digite seu nome"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="pl-10 bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground rounded-md focus:border-primary/50 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-foreground text-sm font-medium mb-2 block">WhatsApp / Telefone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                          <Input
                            id="phone"
                            placeholder="(00) 00000-0000"
                            value={clientPhone}
                            onChange={(e) => {
                              const value = e.target.value
                              setClientPhone(value)
                              onClientPhoneChange?.(value)
                            }}
                            className="pl-10 bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground rounded-md focus:border-primary/50 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Summary - Estilo refinado */}
                    <div className="p-5 rounded-lg bg-secondary/30 border border-border/50">
                      <h4 className="font-serif font-medium text-foreground mb-4 text-sm">Resumo do Agendamento</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-border/30">
                          <span className="text-muted-foreground">Serviço</span>
                          <span className="text-foreground font-medium text-right">{selectedServices.map(s => s.name).join(", ")}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/30">
                          <span className="text-muted-foreground">Data</span>
                          <span className="text-foreground">
                            {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/30">
                          <span className="text-muted-foreground">Horário</span>
                          <span className="text-foreground">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-foreground font-medium">Total</span>
                          <span className="text-primary font-serif text-xl">
                            R$ {totalPrice.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-border/50 text-foreground hover:bg-secondary rounded-md"
                        onClick={() => setStepAndKeepView(2)}
                      >
                        Voltar
                      </Button>
                      <Button
                        className="flex-1 bg-primary text-primary-foreground hover:opacity-90 rounded-md"
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

      {/* Modal de número bloqueado */}
      <Dialog open={showBlockedModal} onOpenChange={setShowBlockedModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-xl font-serif">Agendamento Negado</DialogTitle>
              </div>
            </div>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground text-center py-4">
            ERRO.
          </DialogDescription>
          <Button
            className="w-full"
            onClick={() => setShowBlockedModal(false)}
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  )
}
