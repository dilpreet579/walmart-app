'use client'

import React, { useState } from 'react'
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useCart } from '../contexts/CartContext'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const { itemCount, total } = useCart()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    // Update URL search params
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    router.push(`/?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

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
            <Link href="/category/electronics" className="text-white hover:text-gray-200">
              Electronics
            </Link>
            <Link href="/category/appliances" className="text-white hover:text-gray-200">
              Appliances
            </Link>
            <Link href="/category/footwear" className="text-white hover:text-gray-200">
              Footwear
            </Link>
            <Link href="/category/toys" className="text-white hover:text-gray-200">
              Toys
            </Link>
            <Link href="/category/sports" className="text-white hover:text-gray-200">
              Sports
            </Link>
            <Link href="/category/baby" className="text-white hover:text-gray-200">
              Baby
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="input-search"
                  placeholder="Search everything at Walmart online and in store"
                />
                <MagnifyingGlassIcon
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Cart Icon */}
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
          </div>
        </div>
      </div>
    </nav>
  )
}