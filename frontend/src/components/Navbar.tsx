'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const itemCount = useCartStore(state => state.itemCount)
  const total = useCartStore(state => state.total)

  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const logout = useAuthStore(state => state.logout)
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus)

  useEffect(() => {
    checkAuthStatus()
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'jwt_token') {
        checkAuthStatus()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [checkAuthStatus])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Debounce router push when searchQuery changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      router.push(`/?${params.toString()}`)
    }, 400) // 400ms debounce

    return () => clearTimeout(timeout)
  }, [searchQuery, router])

  return (
    <nav className="bg-walmart-blue sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-white text-xl font-bold cursor-pointer">Walmart</span>
          </Link>

          {/* Deals */}
          <Link href="/deals" className="hidden md:flex items-center bg-walmart-yellow text-black px-3 py-1 rounded-full font-medium hover:bg-yellow-400 transition-colors">
            🔥 Today's Deals
          </Link>

          {/* Categories */}
          <div className="hidden md:flex space-x-4 ml-4">
            <Link href="/category/electronics" className="text-white hover:text-gray-200">Electronics</Link>
            <Link href="/category/appliances" className="text-white hover:text-gray-200">Appliances</Link>
            <Link href="/category/footwear" className="text-white hover:text-gray-200">Footwear</Link>
            <Link href="/category/toys" className="text-white hover:text-gray-200">Toys</Link>
            <Link href="/category/sports" className="text-white hover:text-gray-200">Sports</Link>
            <Link href="/category/baby" className="text-white hover:text-gray-200">Baby</Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="input-search"
                  placeholder="Search everything at Walmart online and in store"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Cart */}
          <div className="flex items-center">
            <Link href="/cart" className="relative group">
              <button className="btn text-white p-2 rounded-full hover:bg-blue-700">
                <ShoppingCartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex-center bg-walmart-yellow text-black text-xs font-bold rounded-full h-5 w-5">
                    {itemCount}
                  </span>
                )}
              </button>
              {itemCount > 0 && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-sm text-gray-700">Cart Total: ${total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{itemCount} items</p>
                </div>
              )}
            </Link>
            {isLoggedIn ? (
              <button
                className="btn btn-secondary text-white ml-2"
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-white hover:underline">Login</Link>
                <Link href="/register" className="text-white hover:underline ml-2">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
