import React from 'react'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative bg-walmart-blue overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-16 md:py-20 lg:py-24 bg-center bg-no-repeat bg-cover" style={{
        }}>
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Save money.</span>
                <span className="block text-walmart-yellow">Live better.</span>
              </h1>
              <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                Shop the best deals on electronics, home essentials, toys, and more. Free shipping on orders $35+.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="#featured-products" 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-walmart-yellow hover:bg-yellow-400 md:py-4 md:text-lg md:px-10">
                    Shop Now
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/deals" 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 md:py-4 md:text-lg md:px-10">
                    View Deals
                  </Link>
                </div>
              </div>
            </div>

            {/* Featured Categories */}
            <div className="mt-12 grid grid-cols-2 gap-6 lg:mt-0 lg:grid-cols-2">
              {categories.map((category, index) => (
                <Link href={category.href} key={index}
                  className="group flex flex-col items-center p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
                  <div className="h-16 w-16 text-white mb-2">
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-white group-hover:text-walmart-yellow">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const categories = [
  {
    name: 'Electronics',
    icon: '/icons/electronics.png',
    href: '/category/electronics',
  },
  {
    name: 'Sports',
    icon: '/images/yoga-mat.jpg',
    href: '/category/sports',
  },
  {
    name: 'Toys',
    icon: '/images/board-games.jpg',
    href: '/category/toys',
  },
  {
    name: 'Footwear',
    icon: '/images/running-shoes.jpg',
    href: '/category/footwear',
  },
]