'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../../components/ProductCard'

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

export default function Deals() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('/api/products')
        const discountedProducts = response.data.filter(
          product => product.discountedPrice !== undefined
        )
        setProducts(discountedProducts)
        setLoading(false)
      } catch (err) {
        setError('Failed to load products')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex-center min-h-[400px]">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    )
  }

  return (
    <div className="container-wrapper section">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Today's Deals</h1>
        <p className="text-gray-600">{products.length} deals available</p>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p>No deals available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}