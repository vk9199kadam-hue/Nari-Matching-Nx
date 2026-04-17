import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/lib/utils'

const statusStyles: Record<string, 'default' | 'warning' | 'success' | 'destructive'> = {
  pending: 'warning',
  processing: 'warning',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
}

export function OrdersPage() {
  const { isAuthenticated, token } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !token) return
    
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, token])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Please sign in</h1>
        <p className="text-sm text-muted-foreground mt-2">Sign in to view your orders</p>
        <Link to="/login" className="text-primary text-sm hover:underline mt-4 inline-block">Sign In</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">No orders yet</p>
          <Link to="/products" className="text-sm text-primary hover:underline mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`}
              className="block bg-card rounded-lg border border-border p-4 md:p-6 hover:shadow-card transition-shadow group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold text-foreground">{order.id}</p>
                    <Badge variant={statusStyles[order.status] || 'default'}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-foreground">{formatPrice(order.total_amount)}</p>
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
