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

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelado" as const } : apt
      )
    )
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
        
        <Gallery />
        
        <Booking 
          selectedServices={selectedServices}
          onToggleService={handleToggleService}
          onAddAppointment={handleAddAppointment}
        />
        
        <MyAppointments 
          appointments={appointments}
          onCancelAppointment={handleCancelAppointment}
        />
      </main>

      <Footer />
    </div>
  )
}
