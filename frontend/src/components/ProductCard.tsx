'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { StarIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  price: number
  discountedPrice?: number
  image: string
  rating: number
  description: string
  category: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const items = useCartStore(state => state.items)
  const addToCart = useCartStore(state => state.addToCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeFromCart = useCartStore(state => state.removeFromCart)

  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const [loginPrompted, setLoginPrompted] = useState(false);

  // Hide login prompt after 3 seconds
  React.useEffect(() => {
    if (loginPrompted) {
      const timer = setTimeout(() => setLoginPrompted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loginPrompted]);
  const { name, price, discountedPrice, image, rating, description } = product
  const [imageError, setImageError] = useState(false)

  const cartItem = useMemo(
    () => items.find(item => item.productId === product.id),
    [items, product.id]
  )

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setLoginPrompted(true);
      return;
    }
    await addToCart(product.id, 1)
  }

  const handleIncrement = async () => {
    if (cartItem) {
      await updateQuantity(product.id, cartItem.quantity + 1)
    }
  }

  const handleDecrement = async () => {
    if (!cartItem) return
    if (cartItem.quantity > 1) {
      await updateQuantity(product.id, cartItem.quantity - 1)
    } else {
      await removeFromCart(product.id)
    }
  }

  const handleImageError = () => setImageError(true)

  return (
    <div className="bg-white rounded-2xl shadow-lg group relative flex flex-col hover:shadow-2xl transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.03] border border-gray-100 overflow-hidden">
      <div className="relative w-full aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={imageError ? '/images/placeholder.jpg' : image}
            alt={name}
            fill
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
          <Link href={`/product/${product.id}`} className="hover:text-walmart-blue transition-colors">
            {name}
          </Link>
        </h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2 min-h-[2.5em]">{description}</p>
        <div className="flex items-center mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-400">({rating})</span>
        </div>
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            {discountedPrice ? (
              <>
                <span className="text-xl font-extrabold text-walmart-blue">${discountedPrice.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-sm">${price.toFixed(2)}</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                  {Math.round(((price - discountedPrice) / price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-walmart-blue">${price.toFixed(2)}</span>
            )}
          </div>
          {cartItem ? (
            <div className="flex items-center justify-between mt-3 bg-blue-50 rounded-xl p-2 shadow-inner">
              <button
                onClick={handleDecrement}
                className="px-3 py-1 rounded-lg bg-white text-walmart-blue font-bold text-lg shadow hover:bg-blue-100 transition disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="font-semibold text-lg text-gray-800">{cartItem.quantity}</span>
              <button
                onClick={handleIncrement}
                className="px-3 py-1 rounded-lg bg-white text-walmart-blue font-bold text-lg shadow hover:bg-blue-100 transition disabled:opacity-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                className="w-full mt-3 py-2 px-4 rounded-xl bg-walmart-blue hover:bg-blue-800 text-white font-bold shadow transition text-base flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loginPrompted && !isLoggedIn}
                aria-busy={loginPrompted && !isLoggedIn}
              >
                Add to Cart
              </button>
              {loginPrompted && !isLoggedIn && (
                <div className="text-red-600 text-xs mt-2 text-center font-medium bg-red-50 border border-red-200 rounded px-2 py-1">You must login to add products to your cart.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}