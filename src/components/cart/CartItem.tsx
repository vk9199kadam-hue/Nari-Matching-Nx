import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore, type CartItem as CartItemType } from '@/store/cartStore'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Image */}
      <div className="w-20 h-24 md:w-24 md:h-28 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground line-clamp-1">{item.name}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {item.size} {item.size !== 'Free Size' && '/ '}{item.color}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</span>
          {item.originalPrice > item.price && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(item.originalPrice)}</span>
          )}
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.variantId)}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
