import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "w-16 h-20 md:w-20 md:h-24 rounded-md overflow-hidden border-2 transition-all",
                selectedIndex === i ? "border-primary shadow-primary-glow" : "border-border hover:border-primary/50"
              )}
            >
              <img src={img} alt={`${productName} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 aspect-[3/4] rounded-lg overflow-hidden bg-secondary/50">
        <img
          src={images[selectedIndex]}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  )
}
