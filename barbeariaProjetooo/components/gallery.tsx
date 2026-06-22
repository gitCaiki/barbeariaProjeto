"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
}

// Placeholder para imagens da galeria - substitua pelos cortes reais
const galleryImages: GalleryImage[] = [
  { id: 1, src: "/images/gallery/Captura de tela 2026-04-13 084839.png", alt: "Corte 1", category: "Cortes" },
  { id: 2, src: "/images/gallery/Captura de tela 2026-04-13 084856.png", alt: "Corte 2", category: "Cortes" },
  { id: 3, src: "/images/gallery/Captura de tela 2026-04-13 084906.png", alt: "Corte 3", category: "Cortes" },
  { id: 4, src: "/images/gallery/Captura de tela 2026-04-13 084915.png", alt: "Corte 4", category: "Cortes" },
  { id: 5, src: "/images/gallery/Captura de tela 2026-04-13 084925.png", alt: "Corte 5", category: "Cortes" },
  { id: 6, src: "/images/gallery/Captura de tela 2026-04-13 084933.png", alt: "Corte 6", category: "Cortes" },
  { id: 7, src: "/images/gallery/Captura de tela 2026-04-13 084954.png", alt: "Corte 7", category: "Cortes" },
  { id: 8, src: "/images/gallery/Captura de tela 2026-04-13 085007.png", alt: "Corte 8", category: "Cortes" },
]

export function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const filteredImages = galleryImages

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  return (
    <section id="galeria" className="py-24 md:py-32 bg-background relative">
      {/* Elemento decorativo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Minimalista */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-primary mb-4"
          >
            Portfólio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6 tracking-wide"
          >
            Nossa <span className="text-primary italic">Galeria</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-xl mx-auto font-light"
          >
            Confira alguns dos nossos trabalhos e inspire-se para o seu próximo visual.
          </motion.p>
        </div>

        {/* Gallery Grid - Estilo refinado */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-secondary/30 border border-border/30 hover:border-primary/30 transition-all duration-300"
              onClick={() => openLightbox(index)}
            >
              <img
                src={encodeURI(image.src)}
                alt={image.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Fallback placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background flex items-center justify-center -z-10">
                <span className="text-4xl font-serif text-primary/20">{image.id}</span>
              </div>

              {/* Hover overlay - Sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Ícone de expandir no hover */}
              <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-card/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-soft">
                <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={1.5} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox - Estilo refinado */}
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Linha decorativa no topo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <button
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-all duration-300"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-all duration-300"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] w-full rounded-lg overflow-hidden shadow-soft"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredImages[currentImageIndex] && (
                <img
                  src={encodeURI(filteredImages[currentImageIndex].src)}
                  alt={filteredImages[currentImageIndex].alt}
                  className="w-full h-full object-contain max-h-[85vh]"
                />
              )}
              {/* Fallback placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background flex flex-col items-center justify-center -z-10">
                <span className="text-8xl font-serif text-primary/20">
                  {filteredImages[currentImageIndex]?.id}
                </span>
              </div>
            </motion.div>

            {/* Contador de imagens */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-wider text-muted-foreground">
              {currentImageIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
