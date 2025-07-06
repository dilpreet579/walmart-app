'use client'

import React, { useState, useMemo } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '../store/cartStore'
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

  const { name, price, discountedPrice, image, rating, description } = product
  const [imageError, setImageError] = useState(false)

  const cartItem = useMemo(
    () => items.find(item => item.productId === product.id),
    [items, product.id]
  )

  const handleAddToCart = async () => {
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
    <div className="product-card group relative">
      <div className="product-image-container">
        <Image
          src={imageError ? '/images/placeholder.jpg' : image}
          alt={name}
          fill
          className="product-image"
          onError={handleImageError}
        />
      </div>
      <div className="flex flex-col h-full">
        <h3 className="product-title">{name}</h3>
        <p className="product-description">
          {description}
        </p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-500">({rating})</span>
        </div>
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            {discountedPrice ? (
              <>
                <p className="product-price">${discountedPrice.toFixed(2)}</p>
                <p className="text-gray-500 line-through text-sm">${price.toFixed(2)}</p>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {Math.round(((price - discountedPrice) / price) * 100)}% OFF
                </span>
              </>
            ) : (
              <p className="product-price">${price.toFixed(2)}</p>
            )}
          </div>
          {cartItem ? (
            <div className="flex items-center justify-between mt-2 bg-gray-100 rounded-lg p-2">
              <button
                onClick={handleDecrement}
                className="btn-secondary px-3 py-1"
              >
                -
              </button>
              <span className="font-semibold">{cartItem.quantity}</span>
              <button
                onClick={handleIncrement}
                className="btn-secondary px-3 py-1"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="btn-primary mt-2 w-full flex-center"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}