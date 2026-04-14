import { useState } from 'react'
import { Search, MapPin, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockOrders, type Order, type OrderStatus } from '@/data/orders'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

const statusOptions: OrderStatus[] = ['processing', 'shipped', 'delivered', 'cancelled']

const statusVariant: Record<string, 'warning' | 'default' | 'success' | 'destructive'> = {
  processing: 'warning',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.fulfillmentStatus !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.address.city.toLowerCase().includes(q) ||
        o.address.pincode.includes(q)
      )
    }
    return true
  })

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o
    ))
    toast.success(`Order ${orderId} updated to ${newStatus}`)
  }

  const exportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'City', 'Pincode', 'Items', 'Total', 'Payment', 'Status', 'Date']
    const rows = filtered.map(o => [
      o.id,
      o.customerName,
      o.customerEmail,
      o.address.phone,
      o.address.city,
      o.address.pincode,
      o.items.map(i => `${i.productName}(${i.quantity})`).join('; '),
      o.totalAmount,
      o.paymentStatus,
      o.fulfillmentStatus,
      new Date(o.createdAt).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Orders exported to CSV')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, city, pincode..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}>
            All
          </button>
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                statusFilter === status ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}>
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Order header */}
            <div
              className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 cursor-pointer hover:bg-secondary/30 transition-colors"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex items-start md:items-center gap-4 flex-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{order.id}</p>
                    <Badge variant={statusVariant[order.fulfillmentStatus]}>
                      {order.fulfillmentStatus}
                    </Badge>
                    <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 md:mt-0">
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === order.id && (
              <div className="border-t border-border p-4 md:p-5 space-y-4 bg-secondary/20 animate-fade-in">
                {/* Customer details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customer</h4>
                    <p className="text-sm text-foreground">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    <p className="text-sm text-muted-foreground">{order.address.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.address.line1}
                      {order.address.line2 && `, ${order.address.line2}`}
                      <br />
                      {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-card">
                        <div className="w-10 h-12 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.size} / {item.color} x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status update */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-sm font-medium text-foreground">Update Status:</span>
                  <div className="flex gap-1.5">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                          order.fulfillmentStatus === status
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
