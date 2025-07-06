import { create } from 'zustand'
import { apiFetch } from '../utils/api'

export interface Address {
  id: number
  userId: number
  line1: string
  city: string
  zip: string
  country: string
  phone: string
}

export interface AddressState {
  addresses: Address[]
  loading: boolean
  error: string | null
  fetchAddresses: () => Promise<void>
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => Promise<void>
  updateAddress: (id: number, address: Partial<Omit<Address, 'id' | 'userId'>>) => Promise<void>
  deleteAddress: (id: number) => Promise<void>
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddresses: async () => {
    set({ loading: true, error: null })
    try {
      const res = await apiFetch(`${API_BASE}/addresses`)
      if (!res.ok) throw new Error('Failed to fetch addresses')
      const data = await res.json()
      set({ addresses: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  addAddress: async (address) => {
    set({ loading: true, error: null })
    try {
      const res = await apiFetch(`${API_BASE}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address)
      })
      if (!res.ok) throw new Error('Failed to add address')
      await get().fetchAddresses()
      set({ loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  updateAddress: async (id, address) => {
    set({ loading: true, error: null })
    try {
      const res = await apiFetch(`${API_BASE}/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address)
      })
      if (!res.ok) throw new Error('Failed to update address')
      await get().fetchAddresses()
      set({ loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  deleteAddress: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await apiFetch(`${API_BASE}/addresses/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete address')
      await get().fetchAddresses()
      set({ loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },
}))