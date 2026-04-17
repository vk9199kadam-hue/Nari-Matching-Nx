import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export function CheckoutPage() {
  const { items, totalPrice, totalSavings, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    line1: '', line2: '', city: '', state: '', pincode: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (items.length === 0) {
    navigate('/cart', { replace: true })
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Please sign in to checkout</h1>
        <p className="text-sm text-muted-foreground mt-2">You need an account to place an order</p>
        <Link to="/login" className="inline-block mt-6">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Name is required'
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone number required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required'
    if (!form.line1.trim()) e.line1 = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state.trim()) e.state = 'State is required'
    if (!form.pincode.trim() || form.pincode.length < 6) e.pincode = 'Valid pincode required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const { token } = useAuthStore.getState()
      const payload = {
        totalAmount: grandTotal,
        shippingAddress: JSON.stringify(form),
        items: items.map(i => ({ 
          product_id: i.productId, 
          variant_id: i.variantId, 
          quantity: i.quantity, 
          price: i.price 
        }))
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to place order')
      }
      
      const { order } = await res.json()

      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`, { state: { newOrder: true, form, items }, replace: true })
    } catch (error: any) {
      toast.error(error.message || 'Error placing order')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const shipping = totalPrice() > 999 ? 0 : 99
  const grandTotal = totalPrice() + shipping

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-5">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" value={form.fullName} onChange={e => updateField('fullName', e.target.value)} error={errors.fullName} placeholder="Enter full name" />
                <Input label="Phone Number" type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} error={errors.phone} placeholder="10-digit phone number" />
                <div className="md:col-span-2">
                  <Input label="Email" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} error={errors.email} placeholder="your@email.com" />
                </div>
                <div className="md:col-span-2">
                  <Input label="Address Line 1" value={form.line1} onChange={e => updateField('line1', e.target.value)} error={errors.line1} placeholder="House/Flat no., Building, Street" />
                </div>
                <div className="md:col-span-2">
                  <Input label="Address Line 2 (Optional)" value={form.line2} onChange={e => updateField('line2', e.target.value)} placeholder="Landmark, Area" />
                </div>
                <Input label="City" value={form.city} onChange={e => updateField('city', e.target.value)} error={errors.city} placeholder="City" />
                <Input label="State" value={form.state} onChange={e => updateField('state', e.target.value)} error={errors.state} placeholder="State" />
                <Input label="Pincode" type="text" value={form.pincode} onChange={e => updateField('pincode', e.target.value)} error={errors.pincode} placeholder="6-digit pincode" />
              </div>
            </div>

            {/* Order items review */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Order Items</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.variantId} className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size} / {item.color} x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Payment Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice() + totalSavings())}</span>
                </div>
                {totalSavings() > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(totalSavings())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-emerald-600">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Grand Total</span>
                  <span className="font-bold text-lg text-foreground">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full mt-6" disabled={loading}>
                {loading ? 'Placing Order...' : `Pay ${formatPrice(grandTotal)}`}
              </Button>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure 256-bit SSL Encrypted Payment
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
