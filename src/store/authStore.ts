import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'customer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (name: string, email: string, password: string, phone?: string) => { success: boolean; error?: string }
  logout: () => void
}

const mockUsers: (User & { password: string })[] = [
  { id: 'admin1', name: 'Nari Matching Nx Admin', email: 'admin@narimatchingnx.com', role: 'admin', phone: '9999999999', password: 'admin123' },
  { id: 'u1', name: 'Priya Sharma', email: 'priya@example.com', role: 'customer', phone: '9876543210', password: 'test123' },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const found = mockUsers.find(u => u.email === email && u.password === password)
        if (found) {
          const { password: _, ...user } = found
          set({ user, isAuthenticated: true })
          return { success: true }
        }
        return { success: false, error: 'Invalid email or password' }
      },

      register: (name, email, _password, phone) => {
        const exists = mockUsers.find(u => u.email === email)
        if (exists) {
          return { success: false, error: 'An account with this email already exists' }
        }
        const newUser: User = {
          id: `u${Date.now()}`,
          name,
          email,
          role: 'customer',
          phone,
        }
        mockUsers.push({ ...newUser, password: _password })
        set({ user: newUser, isAuthenticated: true })
        return { success: true }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'nari-matching-auth' }
  )
)
