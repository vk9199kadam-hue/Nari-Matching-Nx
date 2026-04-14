import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageGallery } from '@/components/product/ImageGallery'
import { VariantSelector } from '@/components/product/VariantSelector'
import { ShareButton } from '@/components/product/ShareButton'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useProductStore } from '@/store/productStore'
import { type ProductVariant } from '@/data/products'
import { getCategoryById } from '@/data/categories'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, calculateFinalPrice } from '@/lib/utils'
import { toast } from 'sonner'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getProductById, getProductsByCategory } = useProductStore()
  const product = getProductById(id || '')
  const addItem = useCartStore(s => s.addItem)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants[0] || null
  )
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Product not found</h1>
        <Link to="/products" className="text-sm text-primary hover:underline mt-4 inline-block">
          Back to all products
        </Link>
      </div>
    )
  }

  const category = getCategoryById(product.category)
  const finalPrice = selectedVariant?.priceOverride
    ? selectedVariant.priceOverride
    : calculateFinalPrice(product.basePrice, product.discountPercent)
  const relatedProducts = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant')
      return
    }
    if (selectedVariant.stock === 0) {
      toast.error('This variant is out of stock')
      return
    }
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        image: product.images[0],
        size: selectedVariant.size,
        color: selectedVariant.color,
        price: finalPrice,
        originalPrice: product.basePrice,
      })
    }
    toast.success(`Added ${quantity}x ${product.name} to cart`)
    setQuantity(1)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/checkout'
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/products?category=${category.id}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.tags.includes('bestseller') && <Badge variant="gold">Bestseller</Badge>}
              {product.tags.includes('new') && <Badge variant="new">New Arrival</Badge>}
              {product.tags.includes('trending') && <Badge variant="default">Trending</Badge>}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-foreground">{formatPrice(finalPrice)}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.basePrice)}</span>
                <Badge variant="discount">{product.discountPercent}% OFF</Badge>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Variant selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />

          {/* Stock info */}
          {selectedVariant && (
            <p className={`text-xs font-medium ${selectedVariant.stock > 5 ? 'text-emerald-600' : selectedVariant.stock > 0 ? 'text-amber-600' : 'text-destructive'}`}>
              {selectedVariant.stock > 5 ? 'In Stock' : selectedVariant.stock > 0 ? `Only ${selectedVariant.stock} left!` : 'Out of Stock'}
            </p>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Quantity</p>
            <div className="flex items-center border border-border rounded-md w-fit">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 text-muted-foreground hover:text-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={handleAddToCart} className="flex-1" disabled={!selectedVariant || selectedVariant.stock === 0}>
              <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button size="lg" variant="gold" onClick={handleBuyNow} className="flex-1" disabled={!selectedVariant || selectedVariant.stock === 0}>
              Buy Now
            </Button>
            <ShareButton productName={product.name} />
          </div>

          {/* Product info */}
          <div className="border-t border-border pt-6 space-y-3">
            {product.fabric && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fabric</span>
                <span className="font-medium text-foreground">{product.fabric}</span>
              </div>
            )}
            {product.careInstructions && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Care</span>
                <span className="font-medium text-foreground">{product.careInstructions}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">{category?.name}</span>
            </div>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: Truck, text: 'Free Delivery' },
              { icon: RotateCcw, text: 'Easy Returns' },
              { icon: Shield, text: 'Secure Pay' },
            ].map(item => (
              <div key={item.text} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/50 text-center">
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-medium text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-border">
          <ProductGrid
            products={relatedProducts}
            title="You May Also Like"
            subtitle="More from this collection"
          />
        </section>
      )}
    </div>
  )
}
