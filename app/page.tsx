"use client"

import { useCallback, useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services, services, type Service } from "@/components/services"
import { Gallery } from "@/components/gallery"
import { Booking, type Appointment } from "@/components/booking"
import { MyAppointments } from "@/components/my-appointments"
import { Footer } from "@/components/footer"
import { normalizePhone } from "@/lib/phone"

const USER_PHONE_STORAGE_KEY = "userPhone"

type ApiAppointment = {
  id: string
  clienteNome: string
  clienteTelefone: string
  servicoNome: string
  duracao: number
  startDateTime: string
  endDateTime: string
  status: "agendado" | "em_andamento" | "finalizado" | "cancelado"
  createdAt: string
}

export default function Home() {
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [persistedPhone, setPersistedPhone] = useState("")

  const mapApiAppointment = useCallback((item: ApiAppointment): Appointment => {
    const start = new Date(item.startDateTime)
    const yyyy = start.getFullYear()
    const mm = String(start.getMonth() + 1).padStart(2, "0")
    const dd = String(start.getDate()).padStart(2, "0")
    const hh = String(start.getHours()).padStart(2, "0")
    const min = String(start.getMinutes()).padStart(2, "0")

    const serviceMatched = services.find((service) => service.name === item.servicoNome)
    const fallbackService: Service = {
      id: Number(item.id.replace(/\D/g, "").slice(0, 9)) || Date.now(),
      name: item.servicoNome,
      description: item.servicoNome,
      price: serviceMatched?.price ?? "R$ 0,00",
      duration: `${item.duracao} min`,
      image: serviceMatched?.image ?? "/images/services/service-1.jpg",
    }

    return {
      id: item.id,
      services: [serviceMatched ?? fallbackService],
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      clientName: item.clienteNome,
      clientPhone: item.clienteTelefone,
      status: item.status === "cancelado" ? "cancelado" : item.status === "finalizado" ? "concluído" : "confirmado",
      createdAt: new Date(item.createdAt),
    }
  }, [])

  const loadAppointmentsByPhone = useCallback(
    async (phoneRaw: string) => {
      const phone = normalizePhone(phoneRaw)
      if (!phone) {
        setAppointments([])
        return
      }

      try {
        const res = await fetch(`/api/agendamentos?telefone=${phone}`)
        const data = (await res.json().catch(() => null)) as null | {
          ok?: boolean
          error?: string
          agendamentos?: ApiAppointment[]
        }
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Falha ao carregar agendamentos")
        }

        setAppointments((data.agendamentos ?? []).map(mapApiAppointment))
      } catch {
        setAppointments([])
      }
    },
    [mapApiAppointment]
  )

  useEffect(() => {
    const savedPhone = localStorage.getItem(USER_PHONE_STORAGE_KEY) ?? ""
    const normalized = normalizePhone(savedPhone)
    if (!normalized) return

    setPersistedPhone(normalized)
    void loadAppointmentsByPhone(normalized)
  }, [loadAppointmentsByPhone])

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

  const handleClientPhoneChange = useCallback(
    (phoneRaw: string) => {
      const normalized = normalizePhone(phoneRaw)
      if (!normalized) return

      localStorage.setItem(USER_PHONE_STORAGE_KEY, normalized)
      setPersistedPhone(normalized)
      void loadAppointmentsByPhone(normalized)
    },
    [loadAppointmentsByPhone]
  )

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
          initialClientPhone={persistedPhone}
          onClientPhoneChange={handleClientPhoneChange}
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
