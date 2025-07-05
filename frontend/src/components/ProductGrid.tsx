'use client'

import React, { useEffect } from 'react'
import ProductCard from './ProductCard'
import { useProductStore } from '../store/productStore'

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
  const { products, loading, error, fetchProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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