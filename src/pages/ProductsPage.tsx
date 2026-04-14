import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useProductStore } from '@/store/productStore'
import { categories, categoryGroups } from '@/data/categories'
import type { CategoryId } from '@/data/categories'
import { cn } from '@/lib/utils'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'discount'

export function ProductsPage() {
  const { products, searchProducts } = useProductStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const groupFilter = searchParams.get('group') || ''
  const categoryFilter = searchParams.get('category') || ''
  const searchQuery = searchParams.get('search') || ''
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(
    categoryFilter ? [categoryFilter as CategoryId] : []
  )

  const filteredProducts = useMemo(() => {
    let result = searchQuery ? searchProducts(searchQuery) : [...products.filter(p => p.isActive)]

    if (groupFilter) {
      const groupName = categoryGroups.find(g => g.slug === groupFilter)?.name || ''
      result = result.filter(p => {
        const cat = categories.find(c => c.id === p.category)
        return cat?.group === groupName
      })
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category))
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price-asc':
        result.sort((a, b) => a.basePrice * (1 - a.discountPercent / 100) - b.basePrice * (1 - b.discountPercent / 100))
        break
      case 'price-desc':
        result.sort((a, b) => b.basePrice * (1 - b.discountPercent / 100) - a.basePrice * (1 - a.discountPercent / 100))
        break
      case 'discount':
        result.sort((a, b) => b.discountPercent - a.discountPercent)
        break
    }

    return result
  }, [searchQuery, groupFilter, selectedCategories, sortBy])

  const relevantCategories = groupFilter
    ? categories.filter(c => {
        const groupName = categoryGroups.find(g => g.slug === groupFilter)?.name
        return c.group === groupName
      })
    : categories

  const toggleCategory = (id: CategoryId) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSearchParams({})
  }

  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : groupFilter
      ? categoryGroups.find(g => g.slug === groupFilter)?.name || 'Products'
      : 'All Products'

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">{filteredProducts.length} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
          </Button>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={cn(
          "w-60 flex-shrink-0",
          showFilters ? "fixed inset-0 z-50 bg-card p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:p-0" : "hidden lg:block"
        )}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="font-display text-lg font-semibold">Filters</h3>
            <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
          </div>

          {(selectedCategories.length > 0 || groupFilter || searchQuery) && (
            <button onClick={clearFilters} className="text-xs text-primary hover:underline mb-4">
              Clear all filters
            </button>
          )}

          {/* Category groups */}
          <div className="space-y-6">
            {groupFilter ? (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Subcategories</h4>
                <div className="space-y-1.5">
                  {relevantCategories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              categoryGroups.map(group => {
                const groupCats = categories.filter(c => c.group === group.name)
                return (
                  <div key={group.slug}>
                    <h4 className="text-sm font-semibold text-foreground mb-3">{group.name}</h4>
                    <div className="space-y-1.5">
                      {groupCats.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => toggleCategory(cat.id)}
                            className="rounded border-input text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {cat.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  )
}
