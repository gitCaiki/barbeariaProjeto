"use client"

import { useState } from "react"
import { Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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

  return (
    <section id="servicos" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-primary mb-4"
          >
            Nossos Serviços
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
            Oferecemos uma variedade de serviços exclusivos para cuidar do seu visual com excelência.
          </motion.p>
        </div>

        {/* Grid de serviços - Cards minimalistas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "group relative bg-card rounded-lg p-6 border border-border/50",
                "hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              )}
            >
              {/* Linha decorativa dourada no topo */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Conteúdo do card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-serif font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Checkbox de seleção */}
                <button
                  onClick={() => onSelectService?.(service)}
                  className={cn(
                    "ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0",
                    isSelected(service)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {isSelected(service) && <Check className="w-3.5 h-3.5" />}
                </button>
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
                  onClick={() => handleSchedule(service)}
                  className="text-primary hover:bg-primary/10 font-medium text-sm"
                >
                  Agendar
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botão Ver Todos */}
        {services.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="border-primary/50 text-foreground hover:bg-primary/5 hover:border-primary px-8 py-3 rounded-md font-medium tracking-wide transition-all duration-300"
            >
              {showAll ? "Ver Menos" : `Ver Todos os Serviços (${services.length})`}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}