"use client"

import { useState } from "react"
import { Calendar, Clock, Scissors, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Appointment } from "@/components/booking"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MyAppointmentsProps {
  appointments: Appointment[]
  onCancelAppointment?: (id: string) => void
}

const statusConfig = {
  confirmado: {
    label: "Confirmado",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  pendente: {
    label: "Pendente",
    icon: Loader2,
    className: "bg-amber-100 text-amber-700 border-amber-200"
  },
  concluído: {
    label: "Concluído",
    icon: CheckCircle2,
    className: "bg-primary/10 text-primary border-primary/20"
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-red-100 text-red-700 border-red-200"
  }
}

export function MyAppointments({ appointments, onCancelAppointment }: MyAppointmentsProps) {
  const [showHistory, setShowHistory] = useState(false)

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })

  const activeAppointments = sortedAppointments.filter(apt => {
    const aptDate = new Date(`${apt.date}T${apt.time}`)
    return aptDate > new Date() && apt.status !== "cancelado" && apt.status !== "concluído"
  })

  const pastAppointments = sortedAppointments.filter(apt => {
    return apt.status === "cancelado" || apt.status === "concluído"
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
        "bg-card border-border/50 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-md",
        isPast && "opacity-60"
      )}>
        {/* Linha decorativa dourada no topo */}
        <div className={cn(
          "h-1 bg-gradient-to-r from-transparent via-primary to-transparent",
          isPast && "via-muted-foreground"
        )} />

        <div className="flex">
          {/* Date sidebar - Estilo refinado */}
          <div className="w-24 bg-secondary/30 flex flex-col items-center justify-center p-4 border-r border-border/30">
            <span className="text-3xl font-serif font-light text-primary">
              {new Date(appointment.date + 'T12:00:00').getDate()}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {new Date(appointment.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
            </span>
            <span className="text-sm font-medium text-foreground mt-2">
              {appointment.time}
            </span>
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Services */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Scissors className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
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
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {formatDate(appointment.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {appointment.services.reduce((sum, s) => {
                      const match = s.duration.match(/(\d+)/)
                      return sum + (match ? parseInt(match[1]) : 0)
                    }, 0)} min
                  </span>
                </div>

                {/* Price */}
                <p className="text-lg font-serif font-light text-primary mt-3">
                  R$ {appointment.services.reduce((sum, s) => {
                    const price = parseFloat(s.price.replace("R$ ", "").replace(",", ".")) || 0
                    return sum + price
                  }, 0).toFixed(2).replace(".", ",")}
                </p>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-end gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium px-3 py-1 rounded-full",
                    status.className
                  )}
                >
                  <StatusIcon className={cn("w-3 h-3 mr-1.5", appointment.status === "pendente" && "animate-spin")} />
                  {status.label}
                </Badge>

                {!isPast && appointment.status === "confirmado" && onCancelAppointment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
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
    <section id="meus-agendamentos" className="py-24 md:py-32 bg-background relative">
      {/* Elemento decorativo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Minimalista */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-primary mb-4"
          >
            Área do Cliente
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6 tracking-wide"
          >
            Meus <span className="text-primary italic">Agendamentos</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-xl mx-auto font-light"
          >
            Acompanhe todos os seus agendamentos em um só lugar.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {appointments.length === 0 ? (
            <Card className="bg-card border-border/50 shadow-soft overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif font-medium text-foreground mb-3">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-muted-foreground mb-8 font-light">
                  Você ainda não tem nenhum agendamento. Que tal agendar agora?
                </p>
                <Button asChild className="bg-primary text-primary-foreground hover:opacity-90 rounded-md px-8">
                  <a href="#agendar">Agendar Horário</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-10">
              {/* Active Appointments */}
              {activeAppointments.length > 0 ? (
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Agendamentos Marcados
                  </h3>
                  <div className="space-y-4">
                    {activeAppointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AppointmentCard appointment={appointment} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="bg-card border-border/50 shadow-soft">
                  <CardContent className="py-10 text-center text-muted-foreground font-light">
                    Nenhum agendamento marcado no momento.
                  </CardContent>
                </Card>
              )}

              {/* Past Appointments */}
              {pastAppointments.length > 0 && (
                <div>
                  <button
                    type="button"
                    className="text-sm uppercase tracking-wider text-muted-foreground mb-6 hover:text-foreground transition-colors flex items-center gap-3 group"
                    onClick={() => setShowHistory((prev) => !prev)}
                  >
                    <span className="w-2 h-2 rounded-full bg-muted-foreground group-hover:bg-foreground transition-colors" />
                    Histórico de Agendamentos
                    <span className="text-lg">{showHistory ? "−" : "+"}</span>
                  </button>

                  {showHistory && (
                    <div className="space-y-4">
                      {pastAppointments.map((appointment, index) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <AppointmentCard appointment={appointment} isPast />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
