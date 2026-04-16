"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services, type Service } from "@/components/services"
import { Gallery } from "@/components/gallery"
import { Booking, type Appointment } from "@/components/booking"
import { MyAppointments } from "@/components/my-appointments"
import { Footer } from "@/components/footer"

export default function Home() {
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const handleToggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.id === service.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== service.id)
      }
      return [...prev, service]
    })
  }

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment])
  }

  const handleCancelAppointment = async (id: string) => {
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelado" }),
      })

      const data = (await res.json().catch(() => null)) as null | { ok?: boolean; error?: string }
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Falha ao cancelar agendamento")
      }

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: "cancelado" as const } : apt
        )
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao cancelar agendamento"
      window.alert(message)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        <Services 
          onSelectService={handleToggleService}
          selectedServices={selectedServices}
        />

        <Booking 
          selectedServices={selectedServices}
          onToggleService={handleToggleService}
          onAddAppointment={handleAddAppointment}
        />

        <Gallery />
        
        <MyAppointments 
          appointments={appointments}
          onCancelAppointment={handleCancelAppointment}
        />
      </main>

      <Footer />
    </div>
  )
}
