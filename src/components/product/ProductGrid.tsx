import type { Product } from '@/data/products'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
}

export function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">No products found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search</p>
      </div>
    )
  }

  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{title}</h2>}
          {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
