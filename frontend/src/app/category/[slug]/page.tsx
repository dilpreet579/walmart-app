import CategoryPage from '../../../components/CategoryPage'

type Params = Promise<{ slug: string }>

export default async function Category(props: { params: Params }) {
  const params = await props.params
  const categoryMap: Record<string, string> = {
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
