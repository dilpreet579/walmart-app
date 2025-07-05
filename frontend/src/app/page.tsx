import React from 'react'
import ProductGrid from '../components/ProductGrid'
import Hero from '../components/Hero'

interface HomePageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams.search || ''
  
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductGrid searchQuery={searchQuery} />
      </div>
    </>
  )
}