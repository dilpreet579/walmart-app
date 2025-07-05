import React from 'react'
import CategoryPage from '../../../components/CategoryPage'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function Category({ params }: CategoryPageProps) {
  const resolvedParams = await params
  
  // Convert slug to proper category name
  const categoryMap: { [key: string]: string } = {
    'electronics': 'Electronics',
    'appliances': 'Appliances',
    'footwear': 'Footwear',
    'toys': 'Toys',
    'sports': 'Sports',
    'baby': 'Baby'
  }
  
  const category = categoryMap[resolvedParams.slug] || resolvedParams.slug

  return <CategoryPage category={category} />
}

export function generateStaticParams() {
  return [
    { slug: 'electronics' },
    { slug: 'appliances' },
    { slug: 'footwear' },
    { slug: 'toys' },
    { slug: 'sports' },
    { slug: 'baby' }
  ]
}