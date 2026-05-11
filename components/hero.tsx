"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

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
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-20"
    >
      {/* Background limpo com imagem do barbeiro mantida */}
      <div className="absolute inset-0 bg-background">
        <Image
          src="/images/thiago-hero.png"
          alt="Studio Feel Barbershop"
          fill
          className="object-contain object-center scale-160 lg:object-contain lg:object-center lg:scale-120 opacity-100"
          priority
        />
        {/* Overlay claro para manter o fundo limpo */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/70 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Elementos decorativos sutis */}
      <div className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden lg:block" />
      <div className="absolute top-20 right-10 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Label superior minimalista */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8"
          >
            Barbearia Premium
          </motion.p>

          {/* Main Title - Tipografia elegante e fina */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-foreground mb-4 leading-[1.1] tracking-wide">
            <span className="block">Studio Feel</span>
          </h1>

          {/* Subtitle com destaque dourado */}
          <p className="text-xl md:text-2xl font-serif text-primary italic mb-8 tracking-wide">
            by Ferreira
          </p>

          {/* Linha decorativa dourada */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10" />

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed font-light">
            Onde a arte do corte encontra a excelência. <br className="hidden md:block" />
            Uma experiência única em cuidados masculinos.
          </p>

          {/* CTA Buttons - Estilo refinado */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:opacity-90 px-10 py-6 text-base font-medium tracking-wide rounded-md transition-all duration-300 shadow-gold"
            >
              <Link href="#agendar" onClick={(e) => handleAnchorClick(e, "#agendar")}>
                Agendar Horário
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/50 text-foreground hover:bg-primary/5 hover:border-primary px-10 py-6 text-base font-medium tracking-wide rounded-md transition-all duration-300"
            >
              <Link href="#galeria" onClick={(e) => handleAnchorClick(e, "#galeria")}>
                Ver Galeria
              </Link>
            </Button>
          </div>

          {/* Stats - Layout minimalista */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border/30"
          >
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-light text-primary">10+</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Anos de Experiência</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-border/50" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-light text-primary">2000+</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Clientes Satisfeitos</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-border/50" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-light text-primary">21</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Serviços Disponíveis</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Minimalista */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link
          href="#agendar"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  )
}
