'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useCartStore } from '../../store/cartStore'
import { useAddressStore } from '../../store/addressStore'
import { useOrderStore } from '../../store/orderStore'
import { executeRecaptcha, verifyCaptchaToken } from '@/utils/recaptcha'
import { getBotSessionData, resetBotSessionData } from '@/utils/botSessionTracker'
import { apiFetch } from '@/utils/api'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const BOT_DETECTION_API = process.env.NEXT_PUBLIC_BOT_DETECTION_API || 'http://localhost:8000/predict_session'

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
      // 0. Bot protection: Google reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha('checkout')
      if (!recaptchaToken) {
        setError('reCAPTCHA failed. Please try again.')
        setLoading(false)
        return
      }
      const captchaOk = await verifyCaptchaToken(recaptchaToken)
      if (!captchaOk) {
        setError('Bot verification failed. Please try again.')
        setLoading(false)
        return
      }
      // 0b. Bot session detection (custom ML)
      try {
        const botSessionData = getBotSessionData()
        console.log('Bot session data:', botSessionData)
        // TODO: set your Python backend URL
        const botRes = await fetch(BOT_DETECTION_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(botSessionData),
        })
        if (botRes.ok) {
          const botPrediction = await botRes.json()
          if (botPrediction.is_bot) {
            setError('Suspicious activity detected. Payment blocked.' + (Array.isArray(botPrediction.risk_factors) && botPrediction.risk_factors.length > 0 ? ' (' + botPrediction.risk_factors.join(', ') + ')' : ''))
            setLoading(false) // bot detected, stop processing
            return
          }
        } else {
          setError('Bot detection service error. Please try again later.')
          setLoading(false)
          return
        }
      } catch (botDetectErr: any) {
        console.error('Error during bot detection:', botDetectErr)
        setError('Error during bot detection: ' + (botDetectErr.message || 'Unknown error'))
        setLoading(false)
        return
      }

      // 1. Create a payment intent
      const paymentRes = await apiFetch(`${API_BASE}/payment/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      await placeOrder(selectedAddressId, paymentIntent.id)
      await clearCart()

      // Reset bot session data after successful payment
      if (typeof window !== 'undefined') {
        resetBotSessionData()
      }

      // 4. Redirect to payment success
      router.push('/payment-success')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-walmart-blue tracking-tight mb-8 text-center">Checkout</h1>
        {error && <div className="text-red-600 text-center mb-4 font-medium bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Address */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">Shipping Address</label>
            <select
              value={selectedAddressId || ''}
              onChange={e => setSelectedAddressId(Number(e.target.value))}
              className="block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-walmart-blue transition"
            >
              <option value="">Select address</option>
              {addresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {`${addr.line1}, ${addr.city}, ${addr.country}`}
                </option>
              ))}
            </select>
            <button type="button" className="mt-2 text-walmart-blue hover:underline text-sm font-semibold" onClick={() => setShowAddForm(v => !v)}>
              {showAddForm ? 'Cancel' : 'Add New Address'}
            </button>
            {showAddForm && (
              <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-walmart-blue focus:border-walmart-blue transition"
                    placeholder="Address Line 1"
                    value={addressForm.line1}
                    onChange={e => setAddressForm(f => ({ ...f, line1: e.target.value }))}
                    required
                  />
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-walmart-blue focus:border-walmart-blue transition"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))}
                    required
                  />
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-walmart-blue focus:border-walmart-blue transition"
                    placeholder="Zip Code"
                    value={addressForm.zip}
                    onChange={e => setAddressForm(f => ({ ...f, zip: e.target.value }))}
                    required
                  />
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-walmart-blue focus:border-walmart-blue transition"
                    placeholder="Country"
                    value={addressForm.country}
                    onChange={e => setAddressForm(f => ({ ...f, country: e.target.value }))}
                    required
                  />
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-walmart-blue focus:border-walmart-blue transition"
                    placeholder="Phone"
                    value={addressForm.phone}
                    onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                {addAddressError && <div className="text-red-600 text-sm mt-2">{addAddressError}</div>}
                <button
                  type="button"
                  className="w-full py-2 px-4 bg-walmart-blue hover:bg-blue-800 text-white font-bold rounded-lg shadow mt-4 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
            <label className="block text-base font-semibold text-gray-700 mb-2">Card Details</label>
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!stripe || loading || !selectedAddressId || addresses.length === 0}
            className={`w-full py-3 px-4 bg-walmart-blue hover:bg-blue-800 text-white font-bold rounded-lg shadow transition text-lg disabled:opacity-60 disabled:cursor-not-allowed ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (<span className="flex items-center justify-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Processing...</span>) : `Pay $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  )
}
