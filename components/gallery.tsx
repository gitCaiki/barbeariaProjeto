"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

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
    <section id="galeria" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Nossa <span className="text-primary italic">Galeria</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira alguns dos nossos trabalhos e inspire-se para o seu próximo visual.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-muted"
              onClick={() => openLightbox(index)}
            >
              <img
                src={encodeURI(image.src)}
                alt={image.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              {/* Fallback placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center -z-10">
                <span className="text-5xl font-serif text-primary/30">{image.id}</span>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div 
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 p-2 text-foreground hover:text-primary transition-colors"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>
            
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-foreground hover:text-primary transition-colors"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-foreground hover:text-primary transition-colors"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div 
              className="relative max-w-4xl max-h-[80vh] w-full aspect-square bg-muted rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredImages[currentImageIndex] && (
                <img
                  src={encodeURI(filteredImages[currentImageIndex].src)}
                  alt={filteredImages[currentImageIndex].alt}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}
              {/* Fallback placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary flex flex-col items-center justify-center -z-10">
                <span className="text-9xl font-serif text-primary/30">
                  {filteredImages[currentImageIndex]?.id}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
