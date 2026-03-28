"use client"

import { useState } from "react"
import { Calendar, Clock, User, Phone, Check, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { services, type Service } from "@/components/services"
import { cn } from "@/lib/utils"

interface BookingProps {
  selectedServices: Service[]
  onToggleService: (service: Service) => void
  onAddAppointment: (appointment: Appointment) => void
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

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00"
]

export function Booking({ selectedServices, onToggleService, onAddAppointment }: BookingProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const totalPrice = selectedServices.reduce((sum, service) => {
    const price = parseFloat(service.price.replace("R$ ", "").replace(",", ".")) || 0
    return sum + price
  }, 0)

  const totalDuration = selectedServices.reduce((sum, service) => {
    const match = service.duration.match(/(\d+)/)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)

  const handleSubmit = () => {
    if (!selectedServices.length || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const appointment: Appointment = {
        id: `APT-${Date.now()}`,
        services: selectedServices,
        date: selectedDate,
        time: selectedTime,
        clientName,
        clientPhone,
        status: "confirmado",
        createdAt: new Date()
      }

      onAddAppointment(appointment)
      setShowSuccess(true)
      setIsSubmitting(false)

      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false)
        setStep(1)
        setSelectedDate("")
        setSelectedTime("")
        setClientName("")
        setClientPhone("")
        selectedServices.forEach(s => onToggleService(s))
      }, 3000)
    }, 1500)
  }

  // Generate next 14 days for date selection
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
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

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Services */}
          {step === 1 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Scissors className="w-5 h-5 text-primary" />
                  Selecione os Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                  {services.map((service) => {
                    const isSelected = selectedServices.some(s => s.id === service.id)
                    return (
                      <div
                        key={service.id}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => onToggleService(service)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{service.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm">
                              <span className="text-primary font-semibold">{service.price}</span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {service.duration}
                              </span>
                            </div>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3",
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          )}>
                            {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {selectedServices.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground">
                        {selectedServices.length} serviço(s) selecionado(s)
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          R$ {totalPrice.toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-sm text-muted-foreground">~{totalDuration} min</p>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setStep(2)}
                    >
                      Continuar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  Escolha Data e Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    {timeSlots.map((time) => (
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
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-foreground"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Client Info */}
          {step === 3 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
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
                        onChange={(e) => setClientPhone(e.target.value)}
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
                      onClick={() => setStep(2)}
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
          )}
        </div>
      </div>
    </section>
  )
}
