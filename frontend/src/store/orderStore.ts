import { create } from 'zustand'
import { apiFetch } from '../utils/api'

export interface Order {
  id: number
  items: Array<{ productId: number; quantity: number }>
  total: number
  status: string
  createdAt: string
}

export interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  placeOrder: (items: Array<{ productId: number; quantity: number }>) => Promise<void>
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null })
    try {
      const res = await apiFetch(`${API_BASE}/orders`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      set({ orders: data.orders, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  placeOrder: async (items) => {
    set({ loading: true, error: null })
    try {
      const res = await apiFetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      if (!res.ok) throw new Error('Failed to place order')
      await get().fetchOrders()
      set({ loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },
}))
