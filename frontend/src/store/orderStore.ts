import { create } from 'zustand'
import { apiFetch } from '../utils/api'

export interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
    price: number
    discountedPrice?: number
    image: string
    rating: number
    description: string
    category: string
  }
}

export interface Order {
  id: number
  total: number
  createdAt: string
  paymentIntentId?: string
  items: OrderItem[]
}

export interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  placeOrder: (addressId: number, paymentIntentId: string) => Promise<void>
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
      set({ orders: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  placeOrder: async (addressId, paymentIntentId) => {
    set({ loading: true, error: null })
    try {
      const res = await apiFetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId, paymentIntentId })
      })
      if (!res.ok) throw new Error('Failed to place order')
      await get().fetchOrders()
      set({ loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },
}))
