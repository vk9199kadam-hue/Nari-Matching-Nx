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
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const API_URL = '/api/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Login failed')
          
          set({ user: data.user, token: data.token, isAuthenticated: true })
          return { success: true }
        } catch (error: any) {
          return { success: false, error: error.message }
        }
      },

      register: async (name, email, password, phone) => {
        try {
          const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Registration failed')
          
          set({ user: data.user, token: data.token, isAuthenticated: true })
          return { success: true }
        } catch (error: any) {
          return { success: false, error: error.message }
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'nari-matching-auth' }
  )
)
