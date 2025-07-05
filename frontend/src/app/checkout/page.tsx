'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '../../store/cartStore'
import { shallow } from 'zustand/shallow'

interface PaymentDetails {
  cardNumber: string
  expiryDate: string
  cvv: string
  name: string
}

export default function Checkout() {
  const router = useRouter()
  const { total, clearCart, items } = useCartStore((state) => ({
    total: state.total,
    clearCart: state.clearCart,
    items: state.items
  })) as {
    total: number;
    clearCart: () => Promise<void>;
    items: import('../../store/cartStore').CartItem[];
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Call real backend payment API
      const jwt = localStorage.getItem('jwt_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/payment/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Stripe expects cents
          currency: 'usd'
        })
      })
      if (!res.ok) throw new Error('Payment failed')
      const data = await res.json()
      // In real Stripe integration, you would use Stripe.js to confirm the payment with clientSecret here
      clearCart()
      router.push('/payment-success')
    } catch (error: any) {
      setError(error.message || 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <div className="container-wrapper section">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-walmart-blue focus:ring-walmart-blue"
                  placeholder="John Doe"
                  value={paymentDetails.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  required
                  maxLength={16}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-walmart-blue focus:ring-walmart-blue"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    required
                    maxLength={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-walmart-blue focus:ring-walmart-blue"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    required
                    maxLength={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-walmart-blue focus:ring-walmart-blue"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
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
        </div>
      </div>
    </div>
  )
}