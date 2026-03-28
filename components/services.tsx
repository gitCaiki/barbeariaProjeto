"use client"

import { useState } from "react"
import { Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    name: "Corte de Cabelo",
    description: "Corte masculino moderno com acabamento perfeito",
    price: "R$ 00,00",
    duration: "45 min",
    image: "/images/services/service-1.jpg",
  },
  {
    id: 2,
    name: "Barba Completa",
    description: "Modelagem e acabamento de barba com navalha",
    price: "R$ 00,00",
    duration: "30 min",
    image: "/images/services/service-2.jpg",
  },
  {
    id: 3,
    name: "Cabelo + Barba",
    description: "Combo completo de corte e barba",
    price: "R$ 00,00",
    duration: "1h 15min",
    image: "/images/services/service-3.jpg",
  },
  {
    id: 4,
    name: "Sobrancelha",
    description: "Design e limpeza de sobrancelha masculina",
    price: "R$ 00,00",
    duration: "15 min",
    image: "/images/services/service-4.jpg",
  },
  {
    id: 5,
    name: "Cabelo + Sobrancelha",
    description: "Corte de cabelo com design de sobrancelha",
    price: "R$ 00,00",
    duration: "1h",
    image: "/images/services/service-5.jpg",
  },
  {
    id: 6,
    name: "Serviço 6",
    description: "Descrição do serviço 6",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-6.jpg",
  },
  {
    id: 7,
    name: "Serviço 7",
    description: "Descrição do serviço 7",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-7.jpg",
  },
  {
    id: 8,
    name: "Serviço 8",
    description: "Descrição do serviço 8",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-8.jpg",
  },
  {
    id: 9,
    name: "Serviço 9",
    description: "Descrição do serviço 9",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-9.jpg",
  },
  {
    id: 10,
    name: "Serviço 10",
    description: "Descrição do serviço 10",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-10.jpg",
  },
  {
    id: 11,
    name: "Serviço 11",
    description: "Descrição do serviço 11",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-11.jpg",
  },
  {
    id: 12,
    name: "Serviço 12",
    description: "Descrição do serviço 12",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-12.jpg",
  },
  {
    id: 13,
    name: "Serviço 13",
    description: "Descrição do serviço 13",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-13.jpg",
  },
  {
    id: 14,
    name: "Serviço 14",
    description: "Descrição do serviço 14",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-14.jpg",
  },
  {
    id: 15,
    name: "Serviço 15",
    description: "Descrição do serviço 15",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-15.jpg",
  },
  {
    id: 16,
    name: "Serviço 16",
    description: "Descrição do serviço 16",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-16.jpg",
  },
  {
    id: 17,
    name: "Serviço 17",
    description: "Descrição do serviço 17",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-17.jpg",
  },
  {
    id: 18,
    name: "Serviço 18",
    description: "Descrição do serviço 18",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-18.jpg",
  },
  {
    id: 19,
    name: "Serviço 19",
    description: "Descrição do serviço 19",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-19.jpg",
  },
  {
    id: 20,
    name: "Serviço 20",
    description: "Descrição do serviço 20",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-20.jpg",
  },
  {
    id: 21,
    name: "Serviço 21",
    description: "Descrição do serviço 21",
    price: "R$ 00,00",
    duration: "00 min",
    image: "/images/services/service-21.jpg",
  },
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

  return (
    <section id="servicos" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
            Nossos Serviços
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Escolha seu <span className="text-primary italic">Estilo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos uma variedade completa de serviços para você sair daqui com o visual perfeito.
            Selecione um ou mais serviços para agendar.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedServices.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "group cursor-pointer overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300",
                isSelected(service) && "border-primary ring-2 ring-primary/20"
              )}
              onClick={() => onSelectService?.(service)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {/* Fallback placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center -z-10">
                  <span className="text-6xl font-serif text-primary/30">{service.id}</span>
                </div>
                
                {/* Selection indicator */}
                {isSelected(service) && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-primary-foreground font-medium">
                    {isSelected(service) ? "Remover" : "Selecionar"}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-serif font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <span className="text-primary font-bold whitespace-nowrap">
                    {service.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More/Less Button */}
        {services.length > 8 && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="border-primary/30 text-foreground hover:bg-primary/10"
            >
              {showAll ? "Ver Menos" : `Ver Todos os ${services.length} Serviços`}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
