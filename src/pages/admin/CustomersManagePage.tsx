import { useState, useEffect } from 'react'
import { Users, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Badge } from '@/components/ui/badge'

export function CustomersManagePage() {
  const { token, isAuthenticated } = useAuthStore()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !token) return
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setCustomers(data)
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [isAuthenticated, token])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Registered Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">View all the users who have created an account on your store.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="font-semibold text-lg">{customers.length}</span>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-xs">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Account Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.phone ? (
                        <span className="text-foreground">{user.phone}</span>
                      ) : (
                        <span className="text-muted-foreground italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.location === 'No orders yet' ? (
                        <Badge variant="warning">No orders yet</Badge>
                      ) : (
                        <span className="text-foreground">{user.location}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
