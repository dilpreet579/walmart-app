import React from 'react'
import CategoryPage from '../../../components/CategoryPage'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function Category({ params }: CategoryPageProps) {
  const categoryMap: { [key: string]: string } = {
    electronics: 'Electronics',
    appliances: 'Appliances',
    footwear: 'Footwear',
    toys: 'Toys',
    sports: 'Sports',
    baby: 'Baby',
  }
  const category = categoryMap[params.slug] || params.slug
  return <CategoryPage category={category} />
}

export function generateStaticParams() {
  return [
    { slug: 'electronics' },
    { slug: 'appliances' },
    { slug: 'footwear' },
    { slug: 'toys' },
    { slug: 'sports' },
    { slug: 'baby' },
  ]
}
