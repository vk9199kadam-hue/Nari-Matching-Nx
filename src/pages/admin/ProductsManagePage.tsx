import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useProductStore } from '@/store/productStore'
import { categories, categoryGroups } from '@/data/categories'
import type { Product, ProductVariant } from '@/data/products'
import { formatPrice, calculateFinalPrice } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminProductsPage() {
  const { products, toggleActive, deleteProduct: removeProduct, addProduct, updateProduct } = useProductStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || (() => {
      const cat = categories.find(c => c.id === p.category)
      const group = categoryGroups.find(g => g.name === cat?.group)
      return group?.slug === categoryFilter
    })()
    return matchSearch && matchCategory
  })

  const handleToggle = (id: string) => {
    toggleActive(id)
    toast.success('Product visibility updated')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      removeProduct(id)
      toast.success('Product deleted')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} total products</p>
        </div>
        <Button onClick={() => { setEditingId(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${categoryFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
            All
          </button>
          {categoryGroups.map(g => (
            <button key={g.slug} onClick={() => setCategoryFilter(g.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${categoryFilter === g.slug ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingId ? products.find(p => p.id === editingId) : undefined}
          onClose={() => { setShowForm(false); setEditingId(null) }}
          onSave={(product) => {
            if (editingId) {
              updateProduct(editingId, product)
              toast.success('Product updated')
            } else {
              addProduct(product as Product)
              toast.success('Product added')
            }
            setShowForm(false)
            setEditingId(null)
          }}
        />
      )}

      {/* Products table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border bg-secondary/30">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(product => {
                const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
                const category = categories.find(c => c.id === product.category)
                return (
                  <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.variants.length} variants</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-foreground text-xs font-medium">{category?.group}</p>
                        <p className="text-muted-foreground text-xs">{category?.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-foreground">{formatPrice(calculateFinalPrice(product.basePrice, product.discountPercent))}</p>
                        {product.discountPercent > 0 && (
                          <p className="text-xs text-muted-foreground line-through">{formatPrice(product.basePrice)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {product.discountPercent > 0
                        ? <Badge variant="discount">{product.discountPercent}%</Badge>
                        : <span className="text-muted-foreground">-</span>}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={totalStock === 0 ? 'destructive' : totalStock <= 10 ? 'warning' : 'success'}>
                        {totalStock}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggle(product.id)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
                          title={product.isActive ? 'Hide' : 'Show'}>
                          {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button onClick={() => { setEditingId(product.id); setShowForm(true) }}
                          className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-secondary transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ── Product form with full variant management ── */
function ProductForm({ product, onClose, onSave }: {
  product?: Product
  onClose: () => void
  onSave: (product: Product | Partial<Product>) => void
}) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [category, setCategory] = useState<string>(product?.category || 'kurtis-short')
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() || '')
  const [discount, setDiscount] = useState(product?.discountPercent?.toString() || '0')
  const [fabric, setFabric] = useState(product?.fabric || '')
  const [careInstructions, setCareInstructions] = useState(product?.careInstructions || '')
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [{ id: `v-${Date.now()}`, sku: '', size: 'M', color: '', stock: 10 }]
  )

  const addVariant = () => {
    setVariants(prev => [...prev, {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sku: '',
      size: 'M',
      color: '',
      stock: 0,
    }])
  }

  const removeVariant = (id: string) => {
    if (variants.length <= 1) { toast.error('At least one variant is required'); return }
    setVariants(prev => prev.filter(v => v.id !== id))
  }

  const updateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const handleSave = () => {
    if (!name.trim()) { toast.error('Product name is required'); return }
    if (!basePrice || parseFloat(basePrice) <= 0) { toast.error('Valid price is required'); return }

    const invalidVariants = variants.filter(v => !v.color.trim())
    if (invalidVariants.length > 0) { toast.error('All variants need a color'); return }

    const categoryImage: Record<string, string> = {
      kurtis: '/images/kurti-product.png', maternity: '/images/maternity-wear.png',
      bottom: '/images/bottom-wear.png', western: '/images/western-dress.png',
      dupatta: '/images/dupatta-product.png', ethnic: '/images/ethnic-wear.png',
    }
    const imgKey = Object.keys(categoryImage).find(k => category.startsWith(k)) || 'ethnic'

    // Auto-generate SKUs for empty ones
    const finalVariants = variants.map((v, i) => ({
      ...v,
      sku: v.sku || `${name.slice(0, 3).toUpperCase()}-${v.size}-${v.color.slice(0, 3).toUpperCase()}-${i}`,
      stock: typeof v.stock === 'string' ? parseInt(v.stock as unknown as string) || 0 : v.stock,
    }))

    onSave({
      id: product?.id || `p-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category: category as any,
      basePrice: parseFloat(basePrice),
      discountPercent: parseInt(discount) || 0,
      images: product?.images || [categoryImage[imgKey]],
      isActive: product?.isActive ?? true,
      fabric: fabric.trim(),
      careInstructions: careInstructions.trim() || 'Machine wash cold',
      tags: product?.tags || [],
      variants: finalVariants,
      createdAt: product?.createdAt || new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-card rounded-lg border border-border p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-5">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input label="Product Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ananya Floral Short Kurti" />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Describe the product..." />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {categoryGroups.map(group => (
                <optgroup key={group.slug} label={group.name}>
                  {categories.filter(c => c.group === group.name).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Base Price (INR)" type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} placeholder="999" />
            <Input label="Discount %" type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" />
            <Input label="Fabric" value={fabric} onChange={e => setFabric(e.target.value)} placeholder="Cotton, Silk" />
          </div>

          <Input label="Care Instructions" value={careInstructions} onChange={e => setCareInstructions(e.target.value)} placeholder="Machine wash cold" />

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground">
                Variants ({variants.length})
              </label>
              <Button variant="outline" size="sm" onClick={addVariant}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Variant
              </Button>
            </div>

            <div className="space-y-2">
              {variants.map((v, index) => (
                <div key={v.id} className="flex items-center gap-2 p-3 rounded-md border border-border bg-secondary/20">
                  <span className="text-xs text-muted-foreground w-5 flex-shrink-0">#{index + 1}</span>
                  <select value={v.size} onChange={e => updateVariant(v.id, 'size', e.target.value)}
                    className="h-8 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring w-20">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input value={v.color} onChange={e => updateVariant(v.id, 'color', e.target.value)}
                    placeholder="Color"
                    className="flex-1 h-8 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring min-w-0" />
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-muted-foreground">Qty:</label>
                    <input type="number" value={v.stock} onChange={e => updateVariant(v.id, 'stock', parseInt(e.target.value) || 0)}
                      className="w-16 h-8 rounded border border-input bg-background px-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0" />
                  </div>
                  <button onClick={() => removeVariant(v.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button onClick={handleSave} className="flex-1">
            {product ? 'Save Changes' : 'Add Product'}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        </div>
      </div>
    </div>
  )
}
