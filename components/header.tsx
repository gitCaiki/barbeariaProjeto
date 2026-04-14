"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#agendar", label: "Agendar" },
  { href: "#galeria", label: "Galeria" },
  { href: "#meus-agendamentos", label: "Meus Agendamentos" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-primary overflow-hidden group-hover:scale-105 transition-transform">
              <Image
                src="/images/services/Gemini_Generated_Image_rooeitrooeitrooe.png"
                alt="Studio Feel"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-foreground tracking-wide">
                Studio Feel
              </span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                by Ferreira
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
              <Link href="#agendar" onClick={(e) => handleAnchorClick(e, "#agendar")}>
                Agendar Agora
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={(e) => {
                    handleAnchorClick(e, link.href)
                    setIsMenuOpen(false)
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                <Link
                  href="#agendar"
                  onClick={(e) => {
                    handleAnchorClick(e, "#agendar")
                    setIsMenuOpen(false)
                  }}
                >
                  Agendar Agora
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
