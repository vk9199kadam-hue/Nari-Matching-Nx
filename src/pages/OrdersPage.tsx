import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'
import { mockOrders } from '@/data/orders'
import { formatPrice } from '@/lib/utils'

const statusStyles: Record<string, 'default' | 'warning' | 'success' | 'destructive'> = {
  processing: 'warning',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
}

export function OrdersPage() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Please sign in</h1>
        <p className="text-sm text-muted-foreground mt-2">Sign in to view your orders</p>
        <Link to="/login" className="text-primary text-sm hover:underline mt-4 inline-block">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">My Orders</h1>

      {mockOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">No orders yet</p>
          <Link to="/products" className="text-sm text-primary hover:underline mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`}
              className="block bg-card rounded-lg border border-border p-4 md:p-6 hover:shadow-card transition-shadow group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold text-foreground">{order.id}</p>
                    <Badge variant={statusStyles[order.fulfillmentStatus]}>
                      {order.fulfillmentStatus.charAt(0).toUpperCase() + order.fulfillmentStatus.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' '} &middot; {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.variantId} className="w-10 h-12 rounded-md overflow-hidden bg-secondary/50">
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
