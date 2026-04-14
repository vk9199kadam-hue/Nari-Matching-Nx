import { Link } from 'react-router-dom'
import { categoryGroups } from '@/data/categories'

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50 mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="font-display text-xl font-bold text-gradient-primary">
              Nari Matching Nx
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted fashion destination for premium ethnic wear, western wear, and everyday fashion at unbeatable prices.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              139/40, Guruwar Peth, Main Road, Karad
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-foreground">Shop By Category</h4>
            <ul className="space-y-2">
              {categoryGroups.map(g => (
                <li key={g.slug}>
                  <Link to={`/products?group=${g.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shopping Cart</Link></li>
              <li><Link to="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">Track Orders</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>139/40, Guruwar Peth,</li>
              <li>Main Road, Karad</li>
              <li>support@narimatchingnx.com</li>
              <li>+91 98765 43210</li>
              <li>Mon - Sat: 10AM - 8PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Nari Matching Nx. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
