import { useParams, Link, useLocation } from 'react-router-dom'
import { ChevronRight, Package, Truck, CheckCircle2, MapPin, Phone, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockOrders } from '@/data/orders'
import { formatPrice } from '@/lib/utils'

const statusSteps = ['processing', 'shipped', 'delivered']

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const isNew = location.state?.newOrder

  const order = isNew
    ? {
        id: id || 'ORD-NEW',
        customerName: location.state.form.fullName,
        customerEmail: location.state.form.email,
        items: location.state.items.map((item: any) => ({
          ...item,
          productName: item.name,
        })),
        address: location.state.form,
        totalAmount: location.state.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0),
        fulfillmentStatus: 'processing',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      }
    : mockOrders.find(o => o.id === id)

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Order not found</h1>
        <Link to="/orders" className="text-sm text-primary hover:underline mt-4 inline-block">Back to orders</Link>
      </div>
    )
  }

  const currentStep = statusSteps.indexOf(order.fulfillmentStatus)

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link to="/orders" className="hover:text-foreground transition-colors">My Orders</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{order.id}</span>
      </nav>

      {isNew && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
          <p className="font-medium">Order placed successfully!</p>
          <p className="text-sm mt-1">Thank you for your order. You will receive a confirmation email shortly.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Order {order.id}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Badge variant={order.fulfillmentStatus === 'delivered' ? 'success' : order.fulfillmentStatus === 'shipped' ? 'default' : 'warning'} className="text-sm px-3 py-1">
          {order.fulfillmentStatus.charAt(0).toUpperCase() + order.fulfillmentStatus.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status timeline */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Order Status</h3>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-border" />
              <div className="absolute top-5 left-[10%] h-0.5 bg-primary transition-all" style={{ width: `${Math.max(0, currentStep) * 40}%` }} />
              {[
                { icon: Package, label: 'Processing' },
                { icon: Truck, label: 'Shipped' },
                { icon: CheckCircle2, label: 'Delivered' },
              ].map((step, i) => (
                <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs font-medium ${i <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="w-14 h-16 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
                    <img src={item.image} alt={item.productName || item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.productName || item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.size} / {item.color} x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Shipping */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-display text-base font-semibold text-foreground mb-3">Shipping Address</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{order.address.fullName}</p>
                  <p>{order.address.line1}</p>
                  {order.address.line2 && <p>{order.address.line2}</p>}
                  <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{order.address.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{order.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-display text-base font-semibold text-foreground mb-3">Payment</h3>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-lg text-foreground">{formatPrice(order.totalAmount)}</span>
            </div>
            <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Badge>
          </div>

          <Link to="/products">
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
