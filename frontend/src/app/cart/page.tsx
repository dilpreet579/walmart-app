'use client'

import React, { useEffect, useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const items = useCartStore(state => state.items)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const total = useCartStore(state => state.total)
  const clearCart = useCartStore(state => state.clearCart)
  const loading = useCartStore(state => state.loading)
  const error = useCartStore(state => state.error)
  const fetchCart = useCartStore(state => state.fetchCart)

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    setIsLoggedIn(!!token)
    if (token) {
      fetchCart()
    }
  }, [fetchCart])

  if (isLoggedIn === false) {
    return (
      <div className="container-wrapper section text-center">
        <h2 className="mb-4">Please log in to view your cart</h2>
        <Link href="/login" className="btn-primary inline-block">Login</Link>
      </div>
    )
  }

  if (loading) {
    return <div className="container-wrapper section text-center">Loading cart...</div>
  }

  if (error) {
    return <div className="container-wrapper section text-center text-red-600">{error}</div>
  }

  if (items.length === 0) {
    return (
      <div className="container-wrapper section">
        <div className="text-center">
          <h2>Your cart is empty</h2>
          <p className="mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-wrapper section">
      <h1>Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {items.map(({ productId, quantity }) => (
            <div key={productId} className="flex items-center border-b py-4">
              {/* Replace this with actual product fetching if needed */}
              <div className="flex-shrink-0 w-24 h-24 relative">
                <Image
                  src={'/images/placeholder.jpg'}
                  alt={'Product'}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium">Product #{productId}</h3>
                <div className="mt-2 flex items-center">
                  <select
                    value={quantity}
                    onChange={(e) => updateQuantity(productId, parseInt(e.target.value))}
                    className="rounded border border-gray-300 py-1 px-2 mr-4"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-walmart-blue font-semibold">
                    Qty: {quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="btn-danger ml-4"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="w-full btn-primary mt-6"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="btn-danger w-full mt-4"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}