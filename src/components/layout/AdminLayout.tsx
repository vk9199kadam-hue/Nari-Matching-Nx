import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft, Boxes } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { Link } from 'react-router-dom'

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products', end: true },
  { to: '/admin/stock', icon: Boxes, label: 'Stock', end: true },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders', end: false },
]

export function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-display text-lg font-bold text-gradient-primary">Nari Matching Nx</Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link to="/" className="font-display text-lg font-bold text-gradient-primary">Nari Matching Nx Admin</Link>
          <nav className="flex gap-2">
            {adminLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end}
                className={({ isActive }) => cn(
                  "p-2 rounded-md transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                )}>
                <link.icon className="h-5 w-5" />
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
