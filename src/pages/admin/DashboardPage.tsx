import { DollarSign, ShoppingBag, Package, TrendingUp, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { mockOrders } from '@/data/orders'
import { useProductStore } from '@/store/productStore'
import { formatPrice } from '@/lib/utils'

export function AdminDashboardPage() {
  const { products } = useProductStore()
  const totalRevenue = mockOrders.reduce((s, o) => s + o.totalAmount, 0)
  const pendingOrders = mockOrders.filter(o => o.fulfillmentStatus === 'processing').length
  const totalProducts = products.length
  const lowStock = products.flatMap(p => p.variants).filter(v => v.stock <= 5).length

  const recentOrders = [...mockOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)

  const topProducts = products
    .filter(p => p.tags.includes('bestseller'))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your store performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-emerald-600 bg-emerald-100' },
          { label: 'Pending Orders', value: pendingOrders.toString(), icon: ShoppingBag, color: 'text-amber-600 bg-amber-100' },
          { label: 'Total Products', value: totalProducts.toString(), icon: Package, color: 'text-sky-600 bg-sky-100' },
          { label: 'Low Stock Alerts', value: lowStock.toString(), icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-display text-base font-semibold text-foreground">Recent Orders</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.id} &middot; {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatPrice(order.totalAmount)}</p>
                  <Badge variant={
                    order.fulfillmentStatus === 'delivered' ? 'success'
                    : order.fulfillmentStatus === 'shipped' ? 'default'
                    : 'warning'
                  } className="mt-1">
                    {order.fulfillmentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-display text-base font-semibold text-foreground">Top Products</h3>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {topProducts.map(product => {
              const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
              return (
                <div key={product.id} className="flex items-center gap-3 p-4">
                  <div className="w-10 h-12 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(product.basePrice)} &middot; Stock: {totalStock}</p>
                  </div>
                  {product.discountPercent > 0 && (
                    <Badge variant="discount">{product.discountPercent}% OFF</Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock > 0 && (
        <div className="bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="font-display text-base font-semibold text-foreground">Low Stock Alerts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3">Variant</th>
                  <th className="px-5 py-3 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.flatMap(p =>
                  p.variants
                    .filter(v => v.stock <= 5)
                    .map(v => (
                      <tr key={v.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
                        <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{v.sku}</td>
                        <td className="px-5 py-3 text-muted-foreground">{v.size} / {v.color}</td>
                        <td className="px-5 py-3 text-right">
                          <Badge variant={v.stock === 0 ? 'destructive' : 'warning'}>{v.stock}</Badge>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
