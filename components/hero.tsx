"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Star } from "lucide-react"

export function Hero() {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return

    e.preventDefault()
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      history.replaceState(null, "", href)
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-background">
        <Image
          src="/images/thiago-hero.png"
          alt="Studio Feel Barbershop"
          fill
          className="object-contain object-center scale-160 lg:object-contain lg:object-center lg:scale-120 opacity-100"
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
        <div className="max-w-4xl mx-auto mt-40 lg:mt-65">
          {/* Badge */}

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-6 leading-tight">
            <span className="block">Studio Feel</span>
            <span className="block text-primary italic">by Ferreira</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Onde a arte do corte encontra a excelência
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg font-medium"
            >
              <Link href="#agendar" onClick={(e) => handleAnchorClick(e, "#agendar")}>
                Agendar Horário
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/30 text-foreground hover:bg-primary/10 px-10 py-6 text-lg"
            >
              <Link href="#galeria" onClick={(e) => handleAnchorClick(e, "#galeria")}>
                Ver Galeria
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border/50">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">10+</p>
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
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <Link
          href="#agendar"
          className="text-muted-foreground hover:text-primary transition-colors"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          <ChevronDown className="w-8 h-8" />
        </Link>
      </div>
    </section>
  )
}
