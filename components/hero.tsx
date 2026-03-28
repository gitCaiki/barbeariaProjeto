"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Star } from "lucide-react"

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Studio Feel Barbershop"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-secondary" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm text-primary font-medium">Barbearia Premium</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-6 leading-tight">
            <span className="block">Studio Feel</span>
            <span className="block text-primary italic">by Thiago Ferreira</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Onde a arte do corte encontra a excelência. Experiência única em barbearia masculina 
            com atendimento personalizado e técnicas exclusivas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg font-medium"
            >
              <Link href="#agendar">Agendar Horário</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/30 text-foreground hover:bg-primary/10 px-10 py-6 text-lg"
            >
              <Link href="#servicos">Ver Serviços</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border/50">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">5+</p>
              <p className="text-sm text-muted-foreground mt-1">Anos de Experiência</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">2000+</p>
              <p className="text-sm text-muted-foreground mt-1">Clientes Satisfeitos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">21</p>
              <p className="text-sm text-muted-foreground mt-1">Serviços Disponíveis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <Link href="#servicos" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronDown className="w-8 h-8" />
        </Link>
      </div>
    </section>
  )
}
