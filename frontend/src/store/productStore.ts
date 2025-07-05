import { create } from 'zustand'

export type Product = {
  id: number
  name: string
  price: number
  discountedPrice?: number
  image: string
  rating: number
  description: string
  category: string
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  getProductById: (id: number) => Product | undefined
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      //intentionally using fetch instead of apiFetch
      const res = await fetch(`${API_BASE}/products`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      set({ products: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },
  getProductById: (id) => {
    return get().products.find(p => p.id === id)
  }
}))
