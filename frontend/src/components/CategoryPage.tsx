'use client'

import { useEffect } from 'react'
import ProductCard from './ProductCard'
import { useProductStore } from '../store/productStore'

interface CategoryPageProps {
  category: string
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const products = useProductStore(state => state.products)
  const loading = useProductStore(state => state.loading)
  const error = useProductStore(state => state.error)
  const fetchProducts = useProductStore(state => state.fetchProducts)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = products.filter(product =>
    product.category.trim().toLowerCase() === category.trim().toLowerCase()
  )

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
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}