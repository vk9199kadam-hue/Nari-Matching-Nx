import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as initialProducts, type Product, type ProductVariant } from '@/data/products'
import type { CategoryId } from '@/data/categories'
import { categories, categoryGroups } from '@/data/categories'

interface ProductStore {
  products: Product[]
  fetchProducts: () => Promise<void>
  addProduct: (product: Product) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  toggleActive: (id: string) => void
  updateVariantStock: (productId: string, variantId: string, stock: number) => Promise<void>
  addVariant: (productId: string, variant: ProductVariant) => void
  removeVariant: (productId: string, variantId: string) => void
  getProductById: (id: string) => Product | undefined
  getActiveProducts: () => Product[]
  getProductsByCategory: (category: CategoryId) => Product[]
  getProductsByCategoryGroup: (groupSlug: string) => Product[]
  searchProducts: (query: string) => Product[]
  getFeaturedProducts: () => Product[]
  getNewArrivals: () => Product[]
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,

      // Initialize by fetching from API
      fetchProducts: async () => {
        try {
          const response = await fetch('/api/products')
          if (!response.ok) throw new Error('API Response not ok')
          const data = await response.json()
          if (Array.isArray(data)) {
            set({ products: data })
          }
        } catch (error) {
          console.error('Failed to fetch products:', error)
        }
      },

      addProduct: async (product) => {
        try {
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
          })
          set(state => ({ products: [...state.products, product] }))
        } catch (error) {
          console.error('Failed to add product:', error)
        }
      },

      updateProduct: async (id, updates) => {
        try {
          // Prepare the full product object for updating
          const current = get().products.find(p => p.id === id)
          if (!current) return
          const updatedProduct = { ...current, ...updates }

          await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
          })

          set(state => ({
            products: state.products.map(p => p.id === id ? updatedProduct : p),
          }))
        } catch (error) {
          console.error('Failed to update product:', error)
        }
      },

      deleteProduct: async (id) => {
        try {
          await fetch(`/api/products/${id}`, {
            method: 'DELETE'
          })
          set(state => ({ products: state.products.filter(p => p.id !== id) }))
        } catch (error) {
          console.error('Failed to delete product:', error)
        }
      },

      toggleActive: (id) => set(state => ({
        products: state.products.map(p =>
          p.id === id ? { ...p, isActive: !p.isActive } : p
        ),
      })),

      updateVariantStock: async (productId, variantId, stock) => {
        try {
          // Update local state first for instant feedback (Optimistic Update)
          set(state => ({
            products: state.products.map(p =>
              p.id === productId
                ? {
                    ...p,
                    variants: p.variants.map(v =>
                      v.id === variantId ? { ...v, stock: Math.max(0, stock) } : v
                    ),
                  }
                : p
            ),
          }))

          // Sync with CockroachDB
          await fetch(`/api/variants/${variantId}/stock`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: Math.max(0, stock) })
          })
        } catch (error) {
          console.error('Failed to update stock in DB:', error)
        }
      },

      addVariant: (productId, variant) => set(state => ({
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, variants: [...p.variants, variant] }
            : p
        ),
      })),

      removeVariant: (productId, variantId) => set(state => ({
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, variants: p.variants.filter(v => v.id !== variantId) }
            : p
        ),
      })),

      getProductById: (id) => get().products.find(p => p.id === id),

      getActiveProducts: () => get().products.filter(p => p.isActive),

      getProductsByCategory: (category) =>
        get().products.filter(p => p.category === category && p.isActive),

      getProductsByCategoryGroup: (groupSlug) => {
        const groupName = categoryGroups.find(g => g.slug === groupSlug)?.name || ''
        return get().products.filter(p => {
          if (!p.isActive) return false
          const cat = categories.find(c => c.id === p.category)
          return cat?.group === groupName
        })
      },

      searchProducts: (query) => {
        const q = query.toLowerCase()
        return get().products.filter(p =>
          p.isActive && (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some(t => t.includes(q))
          )
        )
      },

      getFeaturedProducts: () =>
        get().products.filter(p => p.isActive && p.tags.includes('bestseller')),

      getNewArrivals: () =>
        get().products
          .filter(p => !!p && p.isActive)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6),
    }),
    { name: 'nari-matching-products-v2' }
  )
)
