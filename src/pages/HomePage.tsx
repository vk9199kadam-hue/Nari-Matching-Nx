import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RotateCcw, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useProductStore } from '@/store/productStore'
import { categoryGroups } from '@/data/categories'

const groupImages: Record<string, string> = {
  kurtis: '/images/kurti-product.png',
  maternity: '/images/maternity-wear.png',
  bottom: '/images/bottom-wear.png',
  western: '/images/western-dress.png',
  dupattas: '/images/dupatta-product.png',
  ethnic: '/images/ethnic-wear.png',
}

export function HomePage() {
  const { getFeaturedProducts, getNewArrivals } = useProductStore()
  const featured = getFeaturedProducts()
  const newArrivals = getNewArrivals()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-banner.png" alt="Nari Matching Nx Fashion Collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero" />
        </div>
        <div className="relative z-10 container mx-auto px-4 lg:px-8 py-24 md:py-36 lg:py-44">
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-wider uppercase text-white/70 mb-3">New Season Collection</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Fashion, Your Statement
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed max-w-md">
              Discover handpicked ethnic and western fashion at prices that make you smile. From Kurtis to Lehengas, we have it all.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/products">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 font-semibold shadow-elevated">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/products?group=ethnic">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Explore Ethnic
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Free Shipping', desc: 'On orders above 999' },
              { icon: Shield, label: 'Secure Payments', desc: '100% safe checkout' },
              { icon: RotateCcw, label: 'Easy Returns', desc: '7-day return policy' },
              { icon: Star, label: 'Premium Quality', desc: 'Curated collection' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-secondary">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Shop by Category</h2>
          <p className="text-sm text-muted-foreground mt-2">Browse our curated collections</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryGroups.map(group => (
            <Link
              key={group.slug}
              to={`/products?group=${group.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden"
            >
              <img
                src={groupImages[group.slug]}
                alt={group.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-sm md:text-base font-semibold text-white">{group.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="gradient-warm py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <ProductGrid
            products={featured}
            title="Bestsellers"
            subtitle="Our most-loved pieces, handpicked for you"
          />
          <div className="text-center mt-10">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <ProductGrid
          products={newArrivals}
          title="New Arrivals"
          subtitle="Fresh styles just in, be the first to shop"
        />
      </section>

      {/* CTA Banner */}
      <section className="gradient-primary py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground">
            Join the Nari Matching Nx Family
          </h2>
          <p className="text-primary-foreground/80 mt-3 max-w-md mx-auto">
            Get exclusive access to new arrivals, special offers, and fashion tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 rounded-md px-4 bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            />
            <Button className="bg-white text-foreground hover:bg-white/90 font-semibold h-11">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
