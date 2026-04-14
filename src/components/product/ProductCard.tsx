import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculateFinalPrice } from '@/lib/utils'
import type { Product } from '@/data/products'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false)
  const finalPrice = calculateFinalPrice(product.basePrice, product.discountPercent)
  const uniqueColors = [...new Set(product.variants.map(v => v.color))]

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-secondary/50 aspect-[3/4]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discountPercent > 0 && (
            <Badge variant="discount">{product.discountPercent}% OFF</Badge>
          )}
          {product.tags.includes('new') && <Badge variant="new">New</Badge>}
          {product.tags.includes('bestseller') && <Badge variant="gold">Bestseller</Badge>}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-sm hover:bg-card transition-all"
        >
          <Heart className={`h-4 w-4 transition-colors ${liked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-white/90 font-medium">Quick View</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Color dots */}
        {uniqueColors.length > 1 && (
          <div className="flex gap-1">
            {uniqueColors.slice(0, 4).map(color => (
              <span key={color} className="w-3 h-3 rounded-full border border-border" title={color}
                style={{ backgroundColor: colorToHex(color) }} />
            ))}
            {uniqueColors.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{uniqueColors.length - 4}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{formatPrice(finalPrice)}</span>
          {product.discountPercent > 0 && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.basePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function colorToHex(color: string): string {
  const map: Record<string, string> = {
    'Rose Pink': '#d4a0a0',
    'Sky Blue': '#87ceeb',
    'Ivory White': '#fffff0',
    'Mustard Yellow': '#e2b03e',
    'Sage Green': '#9caf88',
    'Lavender': '#b5a7d5',
    'Blush Pink': '#f4c2c2',
    'Teal': '#008080',
    'Navy Blue': '#000080',
    'Jet Black': '#0a0a0a',
    'Maroon': '#800000',
    'Beige': '#f5deb3',
    'Olive Green': '#6b8e23',
    'Ruby Red': '#9b111e',
    'Gold': '#d4a017',
    'Emerald Green': '#046a38',
    'Off White': '#f8f0e3',
    'Deep Red': '#8b0000',
    'Royal Blue': '#4169e1',
    'Purple': '#7b2d8e',
    'Orange': '#f28500',
    'Sunshine Yellow': '#f9d71c',
    'Powder Blue': '#b0e0e6',
    'Pink': '#ffc0cb',
    'Green': '#228b22',
    'Red': '#dc143c',
    'Black': '#0a0a0a',
  }
  return map[color] || '#ccc'
}
