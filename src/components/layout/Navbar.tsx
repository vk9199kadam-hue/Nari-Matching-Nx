import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { categoryGroups } from '@/data/categories'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const totalItems = useCartStore(s => s.totalItems)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Mobile menu toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-foreground">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-gradient-primary">Nari Matching Nx</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/products" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-secondary">
            All Products
          </Link>
          <div className="relative" onMouseEnter={() => setCategoryOpen(true)} onMouseLeave={() => setCategoryOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-secondary">
              Categories <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", categoryOpen && "rotate-180")} />
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 rounded-lg border border-border bg-card shadow-elevated p-2 animate-fade-in">
                {categoryGroups.map(g => (
                  <Link key={g.slug} to={`/products?group=${g.slug}`} onClick={() => setCategoryOpen(false)}
                    className="block px-3 py-2 text-sm text-card-foreground hover:bg-secondary rounded-md transition-colors">
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-foreground/70 hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-foreground/70 hover:text-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {totalItems() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 flex items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground min-w-[18px] h-[18px]">
                {totalItems()}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 text-foreground/70 hover:text-foreground transition-colors">
                <User className="h-5 w-5" />
                <span className="hidden md:inline text-sm font-medium">{user?.name.split(' ')[0]}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-elevated p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-secondary rounded-md transition-colors">
                    <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                  </Link>
                )}
                <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-secondary rounded-md transition-colors">
                  <ShoppingBag className="h-4 w-4" /> My Orders
                </Link>
                <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-secondary rounded-md transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search bar dropdown */}
      {searchOpen && (
        <div className="border-t border-border bg-card p-4 animate-fade-in">
          <form onSubmit={handleSearch} className="container mx-auto max-w-xl flex gap-2">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for kurtis, lehenga, dupattas..."
              className="flex-1 h-10 rounded-md border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus />
            <Button type="submit" size="sm">Search</Button>
          </form>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container mx-auto p-4 space-y-1">
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-secondary">All Products</Link>
            {categoryGroups.map(g => (
              <Link key={g.slug} to={`/products?group=${g.slug}`} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm text-foreground/80 rounded-md hover:bg-secondary">
                {g.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
