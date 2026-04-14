import { useState } from 'react'
import { Search, Minus, Plus, Package, ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useProductStore } from '@/store/productStore'
import { categories, categoryGroups } from '@/data/categories'
import { formatPrice, calculateFinalPrice } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminStockPage() {
  const { products, updateVariantStock } = useProductStore()
  const [search, setSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(categoryGroups.map(g => [g.slug, true]))
  )
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({})

  const toggleGroup = (slug: string) => {
    setExpandedGroups(prev => ({ ...prev, [slug]: !prev[slug] }))
  }

  const toggleProduct = (id: string) => {
    setExpandedProducts(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleStockChange = (productId: string, variantId: string, delta: number) => {
    const product = products.find(p => p.id === productId)
    const variant = product?.variants.find(v => v.id === variantId)
    if (variant) {
      updateVariantStock(productId, variantId, variant.stock + delta)
      toast.success('Stock updated')
    }
  }

  const handleStockInput = (productId: string, variantId: string, value: string) => {
    const num = parseInt(value)
    if (!isNaN(num) && num >= 0) {
      updateVariantStock(productId, variantId, num)
    }
  }

  const filteredBySearch = (productName: string) => {
    if (!search) return true
    return productName.toLowerCase().includes(search.toLowerCase())
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Stock Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update stock for all product variants organized by category
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category groups */}
      <div className="space-y-4">
        {categoryGroups.map(group => {
          const groupCategories = categories.filter(c => c.group === group.name)
          const groupProducts = products.filter(p =>
            groupCategories.some(c => c.id === p.category) && filteredBySearch(p.name)
          )

          if (groupProducts.length === 0 && search) return null

          const totalGroupStock = groupProducts.reduce(
            (sum, p) => sum + p.variants.reduce((vs, v) => vs + v.stock, 0), 0
          )

          return (
            <div key={group.slug} className="bg-card rounded-lg border border-border overflow-hidden">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.slug)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedGroups[group.slug]
                    ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  }
                  <Package className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h2 className="font-display text-base font-semibold text-foreground">{group.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {groupProducts.length} products &middot; {groupCategories.length} subcategories
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={totalGroupStock === 0 ? 'destructive' : totalGroupStock < 20 ? 'warning' : 'success'}>
                    Total: {totalGroupStock}
                  </Badge>
                </div>
              </button>

              {/* Group content */}
              {expandedGroups[group.slug] && (
                <div className="border-t border-border">
                  {groupCategories.map(cat => {
                    const catProducts = groupProducts.filter(p => p.category === cat.id)
                    if (catProducts.length === 0) return null

                    return (
                      <div key={cat.id}>
                        {/* Subcategory header */}
                        <div className="px-5 py-2.5 bg-secondary/20 border-b border-border">
                          <h3 className="text-sm font-medium text-foreground">{cat.name}</h3>
                        </div>

                        {/* Products in this subcategory */}
                        {catProducts.map(product => {
                          const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
                          const isExpanded = expandedProducts[product.id]

                          return (
                            <div key={product.id} className="border-b border-border last:border-0">
                              {/* Product row */}
                              <button
                                onClick={() => toggleProduct(product.id)}
                                className="w-full flex items-center justify-between px-5 py-3 hover:bg-secondary/20 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {isExpanded
                                    ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                  }
                                  <div className="w-8 h-10 rounded overflow-hidden bg-secondary/50 flex-shrink-0">
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatPrice(calculateFinalPrice(product.basePrice, product.discountPercent))}
                                      {' '}&middot; {product.variants.length} variants
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {!product.isActive && <Badge variant="secondary">Hidden</Badge>}
                                  <Badge variant={totalStock === 0 ? 'destructive' : totalStock <= 10 ? 'warning' : 'success'}>
                                    {totalStock} in stock
                                  </Badge>
                                </div>
                              </button>

                              {/* Variant stock controls */}
                              {isExpanded && (
                                <div className="px-5 pb-4 pt-1 bg-secondary/10 animate-fade-in">
                                  <div className="rounded-md border border-border overflow-hidden">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider bg-secondary/30">
                                          <th className="px-4 py-2">SKU</th>
                                          <th className="px-4 py-2">Size</th>
                                          <th className="px-4 py-2">Color</th>
                                          <th className="px-4 py-2 text-center">Stock</th>
                                          <th className="px-4 py-2 text-center">Update</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border bg-card">
                                        {product.variants.map(variant => (
                                          <tr key={variant.id}>
                                            <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{variant.sku}</td>
                                            <td className="px-4 py-2.5 font-medium text-foreground">{variant.size}</td>
                                            <td className="px-4 py-2.5 text-foreground">{variant.color}</td>
                                            <td className="px-4 py-2.5 text-center">
                                              <Badge variant={variant.stock === 0 ? 'destructive' : variant.stock <= 5 ? 'warning' : 'success'}>
                                                {variant.stock}
                                              </Badge>
                                            </td>
                                            <td className="px-4 py-2.5">
                                              <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                  onClick={() => handleStockChange(product.id, variant.id, -1)}
                                                  disabled={variant.stock === 0}
                                                  className="p-1 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
                                                >
                                                  <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <input
                                                  type="number"
                                                  value={variant.stock}
                                                  onChange={e => handleStockInput(product.id, variant.id, e.target.value)}
                                                  className="w-14 h-7 text-center rounded border border-input bg-background text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                  min="0"
                                                />
                                                <button
                                                  onClick={() => handleStockChange(product.id, variant.id, 1)}
                                                  className="p-1 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                                >
                                                  <Plus className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => handleStockChange(product.id, variant.id, 10)}
                                                  className="px-2 py-1 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                                >
                                                  +10
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
