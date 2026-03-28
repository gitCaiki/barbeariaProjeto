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
  { id: 1, src: "/images/gallery/cut-1.jpg", alt: "Corte degradê", category: "Degradê" },
  { id: 2, src: "/images/gallery/cut-2.jpg", alt: "Corte social", category: "Social" },
  { id: 3, src: "/images/gallery/cut-3.jpg", alt: "Barba modelada", category: "Barba" },
  { id: 4, src: "/images/gallery/cut-4.jpg", alt: "Corte moderno", category: "Moderno" },
  { id: 5, src: "/images/gallery/cut-5.jpg", alt: "Degradê alto", category: "Degradê" },
  { id: 6, src: "/images/gallery/cut-6.jpg", alt: "Corte clássico", category: "Clássico" },
  { id: 7, src: "/images/gallery/cut-7.jpg", alt: "Barba completa", category: "Barba" },
  { id: 8, src: "/images/gallery/cut-8.jpg", alt: "Corte navalhado", category: "Navalhado" },
  { id: 9, src: "/images/gallery/cut-9.jpg", alt: "Degradê médio", category: "Degradê" },
  { id: 10, src: "/images/gallery/cut-10.jpg", alt: "Corte texturizado", category: "Moderno" },
  { id: 11, src: "/images/gallery/cut-11.jpg", alt: "Barba estilizada", category: "Barba" },
  { id: 12, src: "/images/gallery/cut-12.jpg", alt: "Corte undercut", category: "Moderno" },
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
