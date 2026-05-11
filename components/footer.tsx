"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Phone, MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()

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
    <footer className="bg-secondary/30 border-t border-border/50 relative">
      {/* Linha decorativa dourada no topo */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand - Logo destacada */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-4 mb-6 group">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <Image
                  src="/images/services/Gemini_Generated_Image_rooeitrooeitrooe.png"
                  alt="Studio Feel"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-medium text-foreground tracking-wide">
                  Studio Feel
                </span>
                <span className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
                  by Ferreira
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed font-light">
              Experiência única em cortes masculinos. Onde a arte do corte encontra a excelência.
            </p>

            {/* Social Links - Minimalistas */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/thferreira_barbercg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=556781421692&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary mb-6 font-medium">Navegação</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="#inicio"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-light"
                onClick={(e) => handleAnchorClick(e, "#inicio")}
              >
                Início
              </Link>
              <Link
                href="#agendar"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-light"
                onClick={(e) => handleAnchorClick(e, "#agendar")}
              >
                Agendar
              </Link>
              <Link
                href="#galeria"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-light"
                onClick={(e) => handleAnchorClick(e, "#galeria")}
              >
                Galeria
              </Link>
              <Link
                href="#meus-agendamentos"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-light"
                onClick={(e) => handleAnchorClick(e, "#meus-agendamentos")}
              >
                Meus Agendamentos
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary mb-6 font-medium">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Av. dos Crisântemos, 293<br />
                  Vila Sobrinho<br />
                  Campo Grande - MS, 79110-580
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                <p className="text-muted-foreground text-sm font-light">
                  (67) 98142-1692
                </p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary mb-6 font-medium">Horário</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="text-sm">
                  <p className="text-foreground font-medium">Segunda a Sexta</p>
                  <p className="text-muted-foreground font-light">09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="text-sm">
                  <p className="text-foreground font-medium">Sábado</p>
                  <p className="text-muted-foreground font-light">09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="text-sm">
                  <p className="text-foreground font-medium">Domingo</p>
                  <p className="text-muted-foreground font-light">Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Minimalista */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs tracking-wider text-center md:text-left">
              © {currentYear} Studio Feel by Ferreira
            </p>
            <p className="text-xs text-muted-foreground tracking-wider text-center md:text-right">
              Desenvolvido por{" "}
              <a
                href="https://wa.me/5567992680222"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Caiki Lemos
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
