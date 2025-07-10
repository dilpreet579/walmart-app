"use client";
import React from "react";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center py-12 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full flex flex-col items-center relative animate-bounce-in">
        {/* Animated warning icon */}
        <div className="flex items-center justify-center mb-4 animate-pulse">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 drop-shadow-lg" />
        </div>
        <h1 className="text-3xl font-extrabold text-red-600 mb-2 text-center drop-shadow">Payment Failed</h1>
        <p className="text-base text-gray-700 text-center mb-6">
          Unfortunately, your payment could not be completed.<br />
          This may be due to suspicious activity, declined card, or a technical error.<br />
          Please try again or contact support if the issue persists.
        </p>
        <Link href="/cart" className="w-full mt-2 bg-walmart-blue hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-center block animate-fade-in delay-300">
          Return to Cart
        </Link>
        <Link href="/" className="w-full mt-3 bg-walmart-yellow hover:bg-yellow-400 text-walmart-blue font-bold py-3 rounded-xl shadow transition text-center block animate-fade-in delay-500">
          Continue Shopping
        </Link>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in.delay-300 { animation-delay: .3s; }
        .animate-fade-in.delay-500 { animation-delay: .5s; }
        @keyframes bounce-in { 0% { transform: scale(0.92) translateY(40px); opacity: 0;} 100% { transform: scale(1) translateY(0); opacity: 1;} }
        .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
}
