import React from 'react'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function PaymentSuccess() {
  return (
    <div className="container-wrapper section">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}