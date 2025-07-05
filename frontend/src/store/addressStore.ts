import { create } from 'zustand'

export interface Address {
  id: number
  userId: number
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export interface AddressState {
  addresses: Address[]
  loading: boolean
  error: string | null
  fetchAddresses: () => Promise<void>
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => Promise<void>
  updateAddress: (id: number, address: Partial<Address>) => Promise<void>
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
      const token = localStorage.getItem('jwt_token')
      if (!token) throw new Error('Not logged in')
      const res = await fetch(`${API_BASE}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch addresses')
      const data = await res.json()
      set({ addresses: data.addresses, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  addAddress: async (address) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) throw new Error('Not logged in')
      const res = await fetch(`${API_BASE}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(address)
      })
      if (!res.ok) throw new Error('Failed to add address')
      await set({ loading: false })
      await get().fetchAddresses()
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  updateAddress: async (id, address) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) throw new Error('Not logged in')
      const res = await fetch(`${API_BASE}/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(address)
      })
      if (!res.ok) throw new Error('Failed to update address')
      await set({ loading: false })
      await get().fetchAddresses()
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  deleteAddress: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) throw new Error('Not logged in')
      const res = await fetch(`${API_BASE}/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Failed to delete address')
      await set({ loading: false })
      await get().fetchAddresses()
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },
}))
