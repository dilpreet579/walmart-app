'use client'

import { useEffect } from 'react'
import { useCartStore, CartItem } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()

  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus)

  const items: Array<CartItem & { product?: { image: string; name: string; price: number; discountedPrice?: number } }> = useCartStore(state => state.items)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const total = useCartStore(state => state.total)
  const clearCart = useCartStore(state => state.clearCart)
  const loading = useCartStore(state => state.loading)
  const error = useCartStore(state => state.error)
  const fetchCart = useCartStore(state => state.fetchCart)

  useEffect(() => {
    checkAuthStatus()
    if (localStorage.getItem('jwt_token')) {
      fetchCart()
    }
  }, [checkAuthStatus, fetchCart])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
        <h2 className="mb-4">Please log in to view your cart</h2>
        <Link href="/login" className="btn-primary inline-block">Login</Link>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">Loading cart...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 text-red-600">{error}</div>
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
        <div className="py-20 text-center">
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
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-2 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="pt-20 text-3xl font-extrabold text-walmart-blue tracking-tight mb-8 text-center">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center bg-white rounded-xl shadow p-4 hover:shadow-lg transition group">
                  <div className="flex-shrink-0 w-24 h-24 relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <Image
                      src={item.product?.image || '/images/placeholder.jpg'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.product?.name || `Product #${item.productId}`}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                        className="rounded border border-gray-300 py-1 px-2 focus:ring-2 focus:ring-walmart-blue focus:border-walmart-blue transition"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <span className="text-walmart-blue font-bold text-lg">
                        ${(item.product ? (item.product.discountedPrice ?? item.product.price) * item.quantity : 0).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="ml-4 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 shadow-sm transition"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-extrabold text-walmart-blue">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-3 px-4 bg-walmart-blue hover:bg-blue-800 text-white font-bold rounded-lg shadow transition mt-8 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full py-3 px-4 mt-4 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg border border-red-200 shadow-sm transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
