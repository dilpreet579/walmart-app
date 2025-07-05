import { NextResponse } from 'next/server'

type Product = {
  id: number
  name: string
  price: number
  discountedPrice?: number
  image: string
  rating: number
  description: string
  category: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Apple iPhone 13",
    price: 699.99,
    image: "/images/iphone.jpg",
    discountedPrice: 599.99,
    rating: 4.5,
    description: "A15 Bionic chip, Super Retina XDR display, and advanced dual-camera system",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Samsung 55\" 4K Smart TV",
    price: 499.99,
    image: "/images/tv.jpg",
    discountedPrice: 399.99,
    rating: 4.2,
    description: "Crystal UHD, HDR, built-in voice assistants",
    category: "Electronics"
  },
  {
    id: 3,
    name: "Nike Air Max",
    price: 129.99,
    image: "/images/shoes.jpg",
    rating: 4.7,
    description: "Comfortable cushioning and stylish design for everyday wear",
    category: "Footwear"
  },
  {
    id: 4,
    name: "KitchenAid Stand Mixer",
    price: 279.99,
    image: "/images/mixer.jpg",
    discountedPrice: 229.99,
    rating: 4.8,
    description: "10-speed stand mixer with 5-quart stainless steel bowl",
    category: "Appliances"
  },
  {
    id: 5,
    name: "Instant Pot Duo",
    price: 89.99,
    image: "/images/instant-pot.jpg",
    rating: 4.6,
    description: "7-in-1 electric pressure cooker, slow cooker, rice cooker, and more",
    category: "Appliances"
  },
  {
    id: 6,
    name: "LEGO Star Wars Set",
    price: 159.99,
    image: "/images/lego.jpg",
    rating: 4.9,
    description: "Build your own Millennium Falcon with this 1,351-piece set",
    category: "Toys"
  },
  {
    id: 7,
    name: "Dell XPS 13 Laptop",
    price: 1299.99,
    discountedPrice: 1099.99,
    image: "/images/laptop.jpg",
    rating: 4.7,
    description: "13-inch laptop with Intel Core i7, 16GB RAM, 512GB SSD",
    category: "Electronics"
  },
  {
    id: 8,
    name: "Adidas Running Shoes",
    price: 89.99,
    discountedPrice: 69.99,
    image: "/images/running-shoes.jpg",
    rating: 4.3,
    description: "Lightweight running shoes with responsive cushioning",
    category: "Footwear"
  },
  {
    id: 9,
    name: "Dyson Air Purifier",
    price: 399.99,
    image: "/images/air-purifier.jpg",
    rating: 4.8,
    description: "HEPA air purifier with smart sensing and auto mode",
    category: "Appliances"
  },
  {
    id: 10,
    name: "Nintendo Switch",
    price: 299.99,
    discountedPrice: 259.99,
    image: "/images/switch.jpg",
    rating: 4.9,
    description: "Gaming console that you can play at home or on the go",
    category: "Electronics"
  },
  {
    id: 11,
    name: "Outdoor Sandals",
    price: 49.99,
    image: "/images/sandals.jpg",
    rating: 4.2,
    description: "Comfortable sandals perfect for summer",
    category: "Footwear"
  },
  {
    id: 12,
    name: "Coffee Maker",
    price: 149.99,
    discountedPrice: 119.99,
    image: "/images/coffee-maker.jpg",
    rating: 4.6,
    description: "Programmable coffee maker with thermal carafe",
    category: "Appliances"
  },
  {
    id: 13,
    name: "Hot Wheels Set",
    price: 29.99,
    image: "/images/hot-wheels.jpg",
    rating: 4.4,
    description: "20-piece Hot Wheels car collection with track",
    category: "Toys"
  },
  {
    id: 14,
    name: "Smart Watch",
    price: 199.99,
    discountedPrice: 159.99,
    image: "/images/smartwatch.jpg",
    rating: 4.5,
    description: "Fitness tracking smartwatch with heart rate monitor",
    category: "Electronics"
  },
  {
    id: 15,
    name: "Robot Vacuum",
    price: 299.99,
    discountedPrice: 249.99,
    image: "/images/robot-vacuum.jpg",
    rating: 4.3,
    description: "Smart robot vacuum with mapping technology",
    category: "Appliances"
  },
  {
    id: 16,
    name: "Basketball",
    price: 24.99,
    image: "/images/basketball.jpg",
    rating: 4.6,
    description: "Official size basketball for indoor/outdoor use",
    category: "Toys"
  },
  {
    id: 17,
    name: "Wireless Earbuds",
    price: 149.99,
    discountedPrice: 129.99,
    image: "/images/earbuds.jpg",
    rating: 4.7,
    description: "True wireless earbuds with noise cancellation",
    category: "Electronics"
  },
  {
    id: 18,
    name: "Work Boots",
    price: 119.99,
    image: "/images/work-boots.jpg",
    rating: 4.4,
    description: "Steel-toe work boots with water resistance",
    category: "Footwear"
  },
  {
    id: 19,
    name: "Air Fryer",
    price: 129.99,
    discountedPrice: 99.99,
    image: "/images/air-fryer.jpg",
    rating: 4.8,
    description: "Digital air fryer with multiple cooking presets",
    category: "Appliances"
  },
  {
    id: 20,
    name: "Board Game Set",
    price: 39.99,
    discountedPrice: 29.99,
    image: "/images/board-games.jpg",
    rating: 4.5,
    description: "Collection of classic family board games",
    category: "Toys"
  },
  {
    id: 21,
    name: "Gaming Mouse",
    price: 79.99,
    discountedPrice: 59.99,
    image: "/images/gaming-mouse.jpg",
    rating: 4.6,
    description: "RGB gaming mouse with programmable buttons",
    category: "Electronics"
  },
  {
    id: 22,
    name: "Yoga Mat Set",
    price: 45.99,
    discountedPrice: 35.99,
    image: "/images/yoga-mat.jpg",
    rating: 4.7,
    description: "Premium yoga mat with blocks and strap",
    category: "Sports"
  },
  {
    id: 23,
    name: "Smart Doorbell",
    price: 169.99,
    image: "/images/doorbell.jpg",
    rating: 4.6,
    description: "HD video doorbell with two-way audio and motion detection",
    category: "Electronics"
  },
  {
    id: 24,
    name: "Baby Stroller",
    price: 249.99,
    discountedPrice: 199.99,
    image: "/images/stroller.jpg",
    rating: 4.8,
    description: "Convertible baby stroller with multiple reclining positions",
    category: "Baby"
  }
]

export async function GET() {
  return NextResponse.json(products)
}