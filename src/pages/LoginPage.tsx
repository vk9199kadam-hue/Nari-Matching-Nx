import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (result.success) {
      toast.success('Welcome back!')
      navigate('/', { replace: true })
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-bold text-gradient-primary">Nari Matching Nx</Link>
          <h1 className="font-display text-xl font-semibold text-foreground mt-6">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue shopping</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-sm text-destructive">{error}</div>
            )}
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
            <Button type="submit" className="w-full" size="lg">Sign In</Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Create Account</Link>
          </div>

          <div className="mt-4 p-3 rounded-md bg-secondary text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Accounts:</p>
            <p>Admin: admin@narimatchingnx.com / admin123</p>
            <p>Customer: priya@example.com / test123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
