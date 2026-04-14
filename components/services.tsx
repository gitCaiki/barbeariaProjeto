"use client"

import { useState } from "react"
import { Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Service {
  id: number
  name: string
  description: string
  price: string
  duration: string
  image: string
}

// 21 serviços em placeholder para você preencher depois
export const services: Service[] = [
  {
    id: 1,
    name: "Acabamento",
    description: "Corte masculino moderno com acabamento perfeito",
    price: "R$ 25,00",
    duration: "25 min",
    image: "/images/services/service-1.jpg",
  },
  {
    id: 2,
    name: "Barba com ozônio",
    description: "Modelagem e acabamento de barba com ozônio",
    price: "R$ 60,00",
    duration: "40 min",
    image: "/images/services/service-2.jpg",
  },
  {
    id: 3,
    name: "Barba comum",
    description: "Barba comum",
    price: "R$ 50,00",
    duration: "30 min",
    image: "/images/services/service-3.jpg",
  },
  {
    id: 4,
    name: "Coloração",
    description: "Coloração completa do cabelo",
    price: "R$ 50,00",
    duration: "40 min",
    image: "/images/services/service-4.jpg",
  },
  {
    id: 5,
    name: "Cabelo + Sobrancelha",
    description: "Corte de cabelo com design de sobrancelha",
    price: "R$ 70,00",
    duration: "40 min",
    image: "/images/services/service-5.jpg",
  },
  {
    id: 6,
    name: "Combo corte masculino + barba c/ ozônio",
    description: "Descrição do serviço 6",
    price: "R$ 110,00",
    duration: "1h:20 min",
    image: "/images/services/service-6.jpg",
  },
  {
    id: 7,
    name: "Combo corte masculino + barba c/ ozônio + execesso de sobrancelhas",
    description: "Combo para quem quer tudo em um só lugar",
    price: "R$ 120,00",
    duration: "1h:20 min",
    image: "/images/services/service-7.jpg",
  },
  {
    id: 8,
    name: "Combo corte masculino + barba comum",
    description: "Corte de cabelo com barba feita",
    price: "R$ 90,00",
    duration: "1h:00 min",
    image: "/images/services/service-8.jpg",
  },
  {
    id: 9,
    name: "Combo corte masculino + excesso de sobrancelhas",
    description: "Corte de cabelo com excesso de sobrancelhas",
    price: "R$ 70,00",
    duration: "40 min",
    image: "/images/services/service-9.jpg",
  },
  {
    id: 10,
    name: "Combo corte masculino + barba comum + excesso de sobrancelhas",
    description: "Corte de cabelo com barba comum e excesso de sobrancelhas",
    price: "R$ 100,00",
    duration: "1h:00 min",
    image: "/images/services/service-10.jpg",
  },
  {
    id: 11,
    name: "Corte masculino",
    description: "Corte de cabelo padrão masculino",
    price: "R$ 50,00",
    duration: "40 min",
    image: "/images/services/service-11.jpg",
  },
  {
    id: 12,
    name: "Depilação de nariz e ouvido",
    description: "Remoção de pelos do nariz e ouvido",
    price: "R$ 30,00",
    duration: "15 min",
    image: "/images/services/service-12.jpg",
  },
  {
    id: 13,
    name: "Finalização",
    description: "Finalização do corte de cabelo",
    price: "R$ 25,00",
    duration: "20 min",
    image: "/images/services/service-13.jpg",
  },
  {
    id: 14,
    name: "Freestyle",
    description: "Estilo personalizado",
    price: "R$ 30,00",
    duration: "30 min",
    image: "/images/services/service-14.jpg",
  },
  {
    id: 15,
    name: "Luzes",
    description: "Luzes para cabelo",
    price: "R$ 180,00",
    duration: "3h:30 min",
    image: "/images/services/service-15.jpg",
  },
  {
    id: 16,
    name: "Platinado",
    description: "Platinado completo",
    price: "R$ 350,00",
    duration: "3h:30 min",
    image: "/images/services/service-16.jpg",
  },
  {
    id: 17,
    name: "Progressiva",
    description: "Progressiva completa",
    price: "R$ 150,00",
    duration: "1h:30 min",
    image: "/images/services/service-17.jpg",
  },
  {
    id: 18,
    name: "Relaxamento",
    description: "Relaxamento completo",
    price: "R$ 80,00",
    duration: "40 min",
    image: "/images/services/service-18.jpg",
  },
  {
    id: 19,
    name: "Remoção de barba",
    description: "Remoção de toda a barba",
    price: "R$ 40,00",
    duration: "30 min",
    image: "/images/services/service-19.jpg",
  },
  {
    id: 20,
    name: "Remoção do excesso de sobrancelha",
    description: "Remover o excesso de pelos da sobrancelha",
    price: "R$ 20,00",
    duration: "15 min",
    image: "/images/services/service-20.jpg",
  },
  {
    id: 21,
    name: "Selagem",
    description: "Selagem completa",
    price: "R$ 180,00",
    duration: "1h:00 min",
    image: "/images/services/service-21.jpg",
  },
  {
    id: 22,
    name: "Spa Barba",
    description: "Spa completo para barba",
    price: "R$ 160,00",
    duration: "1h:40 min",
    image: "/images/services/service-22.jpg",
  }
]

interface ServicesProps {
  onSelectService?: (service: Service) => void
  selectedServices?: Service[]
}

export function Services({ onSelectService, selectedServices = [] }: ServicesProps) {
  const [showAll, setShowAll] = useState(false)
  
  const displayedServices = showAll ? services : services.slice(0, 8)
  
  const isSelected = (service: Service) => 
    selectedServices.some(s => s.id === service.id)

  const handleSchedule = (service: Service) => {
    onSelectService?.(service)
    document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" })
  }

  return 
}