import { create } from 'zustand'
import { apiFetch } from '../utils/api'

export interface User {
  id: number
  name: string
  email: string
  token?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  fetchUser: () => Promise<void>
  checkAuthStatus: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  isLoggedIn: !!localStorage.getItem('jwt_token'),

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      //intentionally using fetch instead of apiFetch
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      localStorage.setItem('jwt_token', data.token)
      set({ user: data.user, isLoggedIn: true, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('jwt_token')
    set({ user: null, isLoggedIn: false })
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null })
    try {
      //intentionally using fetch instead of apiFetch
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      if (!res.ok) throw new Error('Registration failed')
      const data = await res.json()
      localStorage.setItem('jwt_token', data.token)
      set({ user: data.user, isLoggedIn: true, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null })
    try {
      //here apiFetch is required to get the user data
      const res = await apiFetch(`${API_BASE}/auth/me`)
      if (!res.ok) throw new Error('Failed to fetch user')
      const data = await res.json()
      set({ user: data.user, isLoggedIn: true, loading: false })
    } catch (e: any) {
      set({ error: e.message, isLoggedIn: false, loading: false })
    }
  },

  checkAuthStatus: () => {
    const token = localStorage.getItem('jwt_token')
    set({ isLoggedIn: !!token })
  },
}))