import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/components/cart/CartItem'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export function CartPage() {
  const { items, totalPrice, totalSavings, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="font-display text-xl font-semibold text-foreground">Your cart is empty</h1>
          <p className="text-sm text-muted-foreground mt-2">Looks like you haven't added anything yet</p>
          <Link to="/products" className="inline-block mt-6">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          Shopping Cart ({items.length})
        </h1>
        <button onClick={clearCart} className="text-sm text-destructive hover:underline">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border p-4 md:p-6">
            {items.map(item => (
              <CartItem key={item.variantId} item={item} />
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(totalPrice() + totalSavings())}</span>
              </div>
              {totalSavings() > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>You Save</span>
                  <span className="font-medium">-{formatPrice(totalSavings())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-emerald-600">
                  {totalPrice() > 999 ? 'Free' : formatPrice(99)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-lg text-foreground">
                  {formatPrice(totalPrice() + (totalPrice() > 999 ? 0 : 99))}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="block mt-6">
              <Button size="lg" className="w-full">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link to="/products" className="block mt-3">
              <Button variant="ghost" size="sm" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
