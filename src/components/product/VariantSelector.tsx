import { cn } from '@/lib/utils'
import type { ProductVariant } from '@/data/products'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onSelect: (variant: ProductVariant) => void
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
  const sizes = [...new Set(variants.map(v => v.size))]
  const colors = [...new Set(variants.map(v => v.color))]
  const selectedSize = selectedVariant?.size || ''
  const selectedColor = selectedVariant?.color || ''

  const handleSizeSelect = (size: string) => {
    const match = variants.find(v => v.size === size && v.color === (selectedColor || colors[0]))
      || variants.find(v => v.size === size)
    if (match) onSelect(match)
  }

  const handleColorSelect = (color: string) => {
    const match = variants.find(v => v.color === color && v.size === (selectedSize || sizes[0]))
      || variants.find(v => v.color === color)
    if (match) onSelect(match)
  }

  return (
    <div className="space-y-5">
      {/* Size selector */}
      {sizes.length > 0 && sizes[0] !== 'Free Size' && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2.5">
            Size: <span className="text-muted-foreground font-normal">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const available = variants.some(v => v.size === size && v.stock > 0)
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!available}
                  className={cn(
                    "min-w-[44px] h-10 px-3 rounded-md border text-sm font-medium transition-all",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : available
                        ? "border-border bg-background text-foreground hover:border-primary/50"
                        : "border-border bg-muted text-muted-foreground opacity-40 cursor-not-allowed line-through"
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 1 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2.5">
            Color: <span className="text-muted-foreground font-normal">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => {
              const available = variants.some(v => v.color === color && v.stock > 0)
              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  disabled={!available}
                  className={cn(
                    "px-4 h-9 rounded-full border text-xs font-medium transition-all",
                    selectedColor === color
                      ? "border-primary bg-primary/10 text-primary"
                      : available
                        ? "border-border text-foreground hover:border-primary/50"
                        : "border-border text-muted-foreground opacity-40 cursor-not-allowed"
                  )}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
