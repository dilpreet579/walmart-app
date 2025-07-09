import React from 'react'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-walmart-blue/30 flex items-center justify-center py-12 px-4">
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-fade-in">
        {/* Confetti / Sparkle effect */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* Simple sparkle/confetti effect using emojis for now */}
          <div className="absolute left-4 top-4 text-2xl animate-bounce-slow">✨</div>
          <div className="absolute right-8 top-8 text-xl animate-bounce">🎉</div>
          <div className="absolute left-12 bottom-8 text-xl animate-bounce">💫</div>
          <div className="absolute right-4 bottom-4 text-2xl animate-bounce-slow">🌟</div>
        </div>
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6 animate-pulse" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-walmart-blue mb-4 drop-shadow">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">Thank you for your purchase.<br/>Your order has been confirmed and will be shipped soon.</p>
        <Link href="/" className="inline-block w-full md:w-auto py-3 px-8 rounded-xl bg-walmart-blue hover:bg-blue-800 text-white font-bold text-lg shadow transition mt-2">Continue Shopping</Link>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes bounce-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-16px);} }
        .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
      `}</style>
    </div>
  )
}