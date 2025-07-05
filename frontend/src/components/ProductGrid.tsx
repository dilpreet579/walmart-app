'use client'

import React, { useState, useEffect, useMemo } from 'react'
import ProductCard from './ProductCard'
import axios from 'axios'

interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
  description: string
  category: string
}

interface ProductGridProps {
  searchQuery: string
}

export default function ProductGrid({ searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('/api/products')
        setProducts(response.data)
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
    <div className="section">
      <h2>{searchQuery ? 'Search Results' : 'Featured Products'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.filter(product =>
          searchQuery === '' ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}