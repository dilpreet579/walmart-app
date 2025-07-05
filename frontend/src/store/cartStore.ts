import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

export type Product = {
  id: number
  name: string
  price: number
  image: string
  rating: number
  description: string
  category: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  loading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` }
      })
      if (!res.ok) throw new Error('Failed to fetch cart')
      const data = await res.json()
      set({
        items: data.items,
        total: data.total,
        itemCount: data.itemCount,
        loading: false
      })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ productId, quantity })
      })
      if (!res.ok) throw new Error('Failed to add to cart')
      await get().fetchCart()
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ productId, quantity })
      })
      if (!res.ok) throw new Error('Failed to update cart item')
      await get().fetchCart()
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  removeFromCart: async (productId) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_BASE}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      })
      if (!res.ok) throw new Error('Failed to remove from cart')
      await get().fetchCart()
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      })
      if (!res.ok) throw new Error('Failed to clear cart')
      await get().fetchCart()
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  }
}))

// Usage tip: useCartStore(selector, shallow) to avoid unnecessary re-renders
