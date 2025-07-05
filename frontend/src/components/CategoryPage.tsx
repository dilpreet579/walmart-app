'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
  description: string
  category: string
}

interface CategoryPageProps {
  category: string
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('/api/products')
        const filteredProducts = response.data.filter(
          product => product.category === category
        )
        setProducts(filteredProducts)
        setLoading(false)
      } catch (err) {
        setError('Failed to load products')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

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
      <h1 className="text-2xl font-bold mb-6">{category}</h1>
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p>No products found in this category.</p>
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