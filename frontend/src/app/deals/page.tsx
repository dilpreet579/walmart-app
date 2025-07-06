'use client'

import React, { useEffect } from 'react'
import { useProductStore } from '../../store/productStore'
import ProductCard from '../../components/ProductCard'

export default function Deals() {
  const products = useProductStore(state => state.products)
  const loading = useProductStore(state => state.loading)
  const error = useProductStore(state => state.error)
  const fetchProducts = useProductStore(state => state.fetchProducts)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const discountedProducts = products.filter(product => product.discountedPrice !== null)

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
        <p className="text-gray-600">{discountedProducts.length} deals available</p>
      </div>
      {discountedProducts.length === 0 ? (
        <div className="text-center py-8">
          <p>No deals available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
