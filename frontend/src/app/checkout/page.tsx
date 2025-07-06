'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useCartStore } from '../../store/cartStore'
import { useAddressStore } from '../../store/addressStore'
import { useOrderStore } from '../../store/orderStore'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  )
}

function Checkout() {
  const router = useRouter()

  const total = useCartStore(state => state.total)
  const clearCart = useCartStore(state => state.clearCart)
  const fetchAddresses = useAddressStore(state => state.fetchAddresses)
  const addresses = useAddressStore(state => state.addresses)


  const placeOrder = useOrderStore(state => state.placeOrder)

  const stripe = useStripe()
  const elements = useElements()

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add address form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    line1: '',
    city: '',
    zip: '',
    country: '',
    phone: ''
  })
  const [addAddressLoading, setAddAddressLoading] = useState(false)
  const [addAddressError, setAddAddressError] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !selectedAddressId) {
      setError('Please select a shipping address and enter payment details.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const jwt = localStorage.getItem('jwt_token')

      // 1. Create a payment intent
      const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/payment/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          amount: total, // send dollars, backend multiplies by 100
          currency: 'usd',
        }),
      })

      if (!paymentRes.ok) throw new Error('Failed to create payment intent')
      const { clientSecret } = await paymentRes.json()

      // 2. Confirm payment on frontend
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (stripeError || !paymentIntent || paymentIntent.status !== 'succeeded') {
        throw new Error(stripeError?.message || 'Payment failed')
      }

      // 3. Create order in backend
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentIntentId: paymentIntent.id,
        }),
      })

      if (!orderRes.ok) throw new Error('Failed to place order')

      await placeOrder(selectedAddressId, paymentIntent.id)
      await clearCart()

      router.push('/payment-success')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="container-wrapper section">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
          <select
            value={selectedAddressId ?? ''}
            onChange={e => {
              const val = e.target.value;
              setSelectedAddressId(val ? Number(val) : null)
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select address</option>
            {addresses.map(addr => (
              <option key={addr.id} value={addr.id}>
                {`${addr.line1}, ${addr.city}, ${addr.country}`}
              </option>
            ))}
          </select>
          <button type="button" className="mt-2 text-blue-600 underline text-sm" onClick={() => setShowAddForm(v => !v)}>
            {showAddForm ? 'Cancel' : 'Add New Address'}
          </button>
          {showAddForm && (
            <div className="mt-4 bg-gray-50 p-4 rounded border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="Address Line 1"
                  value={addressForm.line1}
                  onChange={e => setAddressForm(f => ({ ...f, line1: e.target.value }))}
                  required
                />
                <input
                  className="input"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))}
                  required
                />
                <input
                  className="input"
                  placeholder="Zip Code"
                  value={addressForm.zip}
                  onChange={e => setAddressForm(f => ({ ...f, zip: e.target.value }))}
                  required
                />
                <input
                  className="input"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={e => setAddressForm(f => ({ ...f, country: e.target.value }))}
                  required
                />
                <input
                  className="input"
                  placeholder="Phone"
                  value={addressForm.phone}
                  onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
              {addAddressError && <div className="text-red-600 text-sm mt-2">{addAddressError}</div>}
              <button
                type="button"
                className="btn-primary mt-4"
                disabled={addAddressLoading}
                onClick={async () => {
                  setAddAddressLoading(true)
                  setAddAddressError(null)
                  try {
                    await useAddressStore.getState().addAddress(addressForm)
                    await fetchAddresses()
                    // Find the latest address (assuming backend returns new at end)
                    const latest = useAddressStore.getState().addresses.slice(-1)[0]
                    setSelectedAddressId(latest?.id)
                    setShowAddForm(false)
                    setAddressForm({ line1: '', city: '', zip: '', country: '', phone: '' })
                  } catch (err: any) {
                    setAddAddressError(err.message || 'Failed to add address')
                  } finally {
                    setAddAddressLoading(false)
                  }
                }}
              >
                {addAddressLoading ? 'Adding...' : 'Save Address'}
              </button>
            </div>
          )}
        </div>

        {/* Card */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
          <div className="p-3 border rounded-md bg-white">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!stripe || loading || !selectedAddressId || addresses.length === 0}
          className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}
