'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const itemCount = useCartStore(state => state.itemCount)
  const total = useCartStore(state => state.total)

  const user = useAuthStore(state => state.user)
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
    <nav className="w-full top-0 z-50 bg-gradient-to-r from-walmart-blue to-blue-700 shadow-lg rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/">
            <span className="flex-shrink-0 flex items-center gap-2">
              <Image src="/icons/spark-icon.svg" alt="Spark Icon" width={24} height={24} className="h-6 w-6" />
              <span className="text-white text-2xl font-extrabold cursor-pointer tracking-tight">Walmart</span>
            </span>
          </Link>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-yellow text-white hover:bg-walmart-yellow hover:text-walmart-blue transition"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Open menu"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Categories (desktop) */}
          <div className="hidden md:flex space-x-3 ml-4">
            {['electronics', 'appliances', 'footwear', 'toys', 'sports', 'baby'].map((cat) => (
              <Link key={cat} href={`/category/${cat}`} className="px-3 py-1 rounded-lg text-white font-medium hover:bg-walmart-yellow hover:text-walmart-blue transition capitalize focus:outline-none focus:ring-2 focus:ring-walmart-yellow">
                {cat}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-walmart-yellow focus:border-walmart-yellow shadow-sm placeholder-gray-400 text-gray-800 transition"
                  placeholder="Search everything at Walmart online and in store"
                />
              </div>
            </form>
          </div>

          {/* Right Side (desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/cart" className="relative group">
              <button className="p-2 rounded-full bg-white/10 hover:bg-walmart-yellow hover:text-walmart-blue text-white transition shadow-sm focus:outline-none focus:ring-2 focus:ring-walmart-yellow">
                <ShoppingCartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center bg-walmart-yellow text-walmart-blue text-xs font-extrabold rounded-full h-6 w-6 ring-2 ring-white shadow">
                    {itemCount}
                  </span>
                )}
              </button>
              {itemCount > 0 && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-100">
                  <p className="text-sm text-gray-700 font-semibold">Cart Total: <span className="text-walmart-blue font-bold">${total.toFixed(2)}</span></p>
                  <p className="text-xs text-gray-500">{itemCount} items</p>
                </div>
              )}
            </Link>

            {/* Auth */}
            {isLoggedIn && user ? (
              <>
                <span className="text-white font-semibold px-2">{user.name}</span>
                <button
                  className="px-4 py-1 rounded-lg bg-walmart-yellow text-walmart-blue font-bold ml-2 shadow hover:bg-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-walmart-yellow"
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white hover:underline font-semibold">Login</Link>
                <Link href="/register" className="text-white hover:underline ml-2 font-semibold">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)} />
      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white rounded-b-2xl shadow-2xl border-b border-gray-200 px-6 pt-4 pb-8 transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden`}> 
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <span className="text-walmart-blue text-2xl font-extrabold cursor-pointer tracking-tight">Walmart</span>
          </Link>
          <button className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-walmart-yellow" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2 mb-6">
          {['electronics', 'appliances', 'footwear', 'toys', 'sports', 'baby'].map((cat) => (
            <Link key={cat} href={`/category/${cat}`} className="px-4 py-2 rounded-lg text-walmart-blue font-semibold hover:bg-walmart-yellow hover:text-walmart-blue transition capitalize" onClick={() => setMobileMenuOpen(false)}>
              {cat}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 mb-6">
          <Link href="/cart" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-walmart-yellow transition font-semibold text-walmart-blue" onClick={() => setMobileMenuOpen(false)}>
            <ShoppingCartIcon className="h-6 w-6" />
            Cart{itemCount > 0 && <span className="ml-2 bg-walmart-yellow text-walmart-blue rounded-full px-2 py-0.5 text-xs font-bold">{itemCount}</span>}
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {isLoggedIn && user ? (
            <>
              <span className="text-walmart-blue font-bold px-4">{user.name}</span>
              <button
                className="w-full px-4 py-2 rounded-lg bg-walmart-yellow text-walmart-blue font-bold shadow hover:bg-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-walmart-yellow mt-1"
                onClick={() => {
                  logout()
                  router.push('/login')
                  setMobileMenuOpen(false)
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-walmart-blue hover:underline font-semibold px-4 py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/register" className="text-walmart-blue hover:underline font-semibold px-4 py-2" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
