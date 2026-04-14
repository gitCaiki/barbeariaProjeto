"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Phone, MapPin, Clock } from "lucide-react"

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
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary overflow-hidden">
                <Image
                  src="/images/services/Gemini_Generated_Image_rooeitrooeitrooe.png"
                  alt="Studio Feel"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold text-foreground">
                  Studio Feel
                </span>
                <span className="text-xs text-muted-foreground tracking-widest uppercase">
                  by Ferreira
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Experiência única em cortes masculinos. Onde a arte do corte encontra a excelência.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.instagram.com/thferreira_barbercg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=556781421692&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Links Rápidos</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="#inicio"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                onClick={(e) => handleAnchorClick(e, "#inicio")}
              >
                Início
              </Link>
              <Link
                href="#galeria"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                onClick={(e) => handleAnchorClick(e, "#galeria")}
              >
                Galeria
              </Link>
              <Link
                href="#meus-agendamentos"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                onClick={(e) => handleAnchorClick(e, "#meus-agendamentos")}
              >
                Meus Agendamentos
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground text-sm">
                  Av. dos Crisântemos, 293<br />
                  Vila Sobrinho<br />
                  Campo Grande - MS, 79110-580
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  (67) 98142-1692
                </p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Horário de Funcionamento</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-foreground">Segunda a Sexta</p>
                  <p className="text-muted-foreground">09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-foreground">Sábado</p>
                  <p className="text-muted-foreground">09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-foreground">Domingo</p>
                  <p className="text-muted-foreground">Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {currentYear} Studio Feel by Ferreira. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Desenvolvido por <span className="text-primary font-medium">Caiki Lemos</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
