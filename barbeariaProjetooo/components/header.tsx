"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#agendar", label: "Agendar" },
  { href: "#galeria", label: "Galeria" },
  { href: "#meus-agendamentos", label: "Meus Agendamentos" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return

    e.preventDefault()
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      history.replaceState(null, "", href)
      // Compensar a altura do header fixo (96px = 24rem = h-24)
      const headerOffset = 96
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      {/* Linha decorativa dourada no topo quando scrollado */}
      <div
        className={`h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo - Mais destacada e elegante */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
              <Image
                src="/images/services/Gemini_Generated_Image_rooeitrooeitrooe.png"
                alt="Studio Feel"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-serif font-medium text-foreground tracking-wide">
                Studio Feel
              </span>
              <span className="text-[10px] lg:text-xs text-muted-foreground tracking-[0.3em] uppercase">
                by Ferreira
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Minimalista */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide group"
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                {link.label}
                {/* Underline animado dourado */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* CTA Button + Theme Toggle - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 rounded-md font-medium tracking-wide transition-all duration-300"
            >
              <Link href="#agendar" onClick={(e) => handleAnchorClick(e, "#agendar")}>
                Agendar
              </Link>
            </Button>
          </div>

          {/* Theme Toggle + Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              className="p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Full screen overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 top-[80px] z-40 bg-background"
            >
              <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="h-full overflow-y-auto"
              >
                <div className="flex flex-col py-6 px-4 sm:px-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link
                        href={link.href}
                        className="block w-full text-lg font-medium text-muted-foreground hover:text-primary hover:bg-secondary/30 rounded-lg transition-all duration-300 py-4 px-4 mb-2"
                        onClick={(e) => {
                          handleAnchorClick(e, link.href)
                          setIsMenuOpen(false)
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 }}
                    className="pt-6 px-4"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-md font-medium py-6 text-base"
                    >
                      <Link
                        href="#agendar"
                        onClick={(e) => {
                          handleAnchorClick(e, "#agendar")
                          setIsMenuOpen(false)
                        }}
                      >
                        Agendar Horário
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
