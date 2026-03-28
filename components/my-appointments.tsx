"use client"

import { Calendar, Clock, Scissors, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Appointment } from "@/components/booking"
import { cn } from "@/lib/utils"

interface MyAppointmentsProps {
  appointments: Appointment[]
  onCancelAppointment?: (id: string) => void
}

const statusConfig = {
  confirmado: {
    label: "Confirmado",
    icon: CheckCircle2,
    className: "bg-green-500/20 text-green-400 border-green-500/30"
  },
  pendente: {
    label: "Pendente",
    icon: Loader2,
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  },
  concluído: {
    label: "Concluído",
    icon: CheckCircle2,
    className: "bg-primary/20 text-primary border-primary/30"
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-red-500/20 text-red-400 border-red-500/30"
  }
}

export function MyAppointments({ appointments, onCancelAppointment }: MyAppointmentsProps) {
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })

  const upcomingAppointments = sortedAppointments.filter(apt => {
    const aptDate = new Date(`${apt.date}T${apt.time}`)
    return aptDate > new Date() && apt.status !== "cancelado"
  })

  const pastAppointments = sortedAppointments.filter(apt => {
    const aptDate = new Date(`${apt.date}T${apt.time}`)
    return aptDate <= new Date() || apt.status === "cancelado"
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  const AppointmentCard = ({ appointment, isPast }: { appointment: Appointment; isPast?: boolean }) => {
    const status = statusConfig[appointment.status]
    const StatusIcon = status.icon

    return (
      <Card className={cn(
        "bg-card border-border overflow-hidden transition-all",
        isPast && "opacity-70"
      )}>
        <div className="flex">
          {/* Date sidebar */}
          <div className="w-24 bg-primary/10 flex flex-col items-center justify-center p-4 border-r border-border">
            <span className="text-3xl font-bold text-primary">
              {new Date(appointment.date + 'T12:00:00').getDate()}
            </span>
            <span className="text-xs uppercase text-muted-foreground">
              {new Date(appointment.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
            </span>
            <span className="text-sm font-medium text-foreground mt-2">
              {appointment.time}
            </span>
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Services */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Scissors className="w-4 h-4 text-primary flex-shrink-0" />
                  {appointment.services.map((service, idx) => (
                    <span key={service.id}>
                      <span className="text-foreground font-medium">{service.name}</span>
                      {idx < appointment.services.length - 1 && (
                        <span className="text-muted-foreground">, </span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(appointment.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {appointment.services.reduce((sum, s) => {
                      const match = s.duration.match(/(\d+)/)
                      return sum + (match ? parseInt(match[1]) : 0)
                    }, 0)} min
                  </span>
                </div>

                {/* Price */}
                <p className="text-lg font-bold text-primary mt-2">
                  R$ {appointment.services.reduce((sum, s) => {
                    const price = parseFloat(s.price.replace("R$ ", "").replace(",", ".")) || 0
                    return sum + price
                  }, 0).toFixed(2).replace(".", ",")}
                </p>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-end gap-3">
                <Badge className={cn("border", status.className)}>
                  <StatusIcon className={cn("w-3 h-3 mr-1", appointment.status === "pendente" && "animate-spin")} />
                  {status.label}
                </Badge>

                {!isPast && appointment.status === "confirmado" && onCancelAppointment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onCancelAppointment(appointment.id)}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <section id="meus-agendamentos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
            Área do Cliente
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Meus <span className="text-primary italic">Agendamentos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acompanhe todos os seus agendamentos em um só lugar.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {appointments.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não tem nenhum agendamento. Que tal agendar agora?
                </p>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href="#agendar">Agendar Horário</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Appointments */}
              {upcomingAppointments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Próximos Agendamentos
                  </h3>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Appointments */}
              {pastAppointments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-4">
                    Histórico
                  </h3>
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} isPast />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
