const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Apple iPhone 13",
        price: 699.99,
        image: "/images/iphone.jpg",
        discountedPrice: 599.99,
        rating: 4.5,
        description: "A15 Bionic chip, Super Retina XDR display, and advanced dual-camera system",
        category: "Electronics"
      },
      {
        name: "Samsung 55\" 4K Smart TV",
        price: 499.99,
        image: "/images/tv.jpg",
        discountedPrice: 399.99,
        rating: 4.2,
        description: "Crystal UHD, HDR, built-in voice assistants",
        category: "Electronics"
      },
      {
        name: "Nike Air Max",
        price: 129.99,
        image: "/images/shoes.jpg",
        rating: 4.7,
        description: "Comfortable cushioning and stylish design for everyday wear",
        category: "Footwear"
      },
      {
        name: "KitchenAid Stand Mixer",
        price: 279.99,
        discountedPrice: 229.99,
        image: "/images/mixer.jpg",
        rating: 4.8,
        description: "10-speed stand mixer with 5-quart stainless steel bowl",
        category: "Appliances"
      },
      {
        name: "Instant Pot Duo",
        price: 89.99,
        image: "/images/instant-pot.jpg",
        rating: 4.6,
        description: "7-in-1 electric pressure cooker, slow cooker, rice cooker, and more",
        category: "Appliances"
      },
      {
        name: "LEGO Star Wars Set",
        price: 159.99,
        image: "/images/lego.jpg",
        rating: 4.9,
        description: "Build your own Millennium Falcon with this 1,351-piece set",
        category: "Toys"
      },
      {
        name: "Dell XPS 13 Laptop",
        price: 1299.99,
        discountedPrice: 1099.99,
        image: "/images/laptop.jpg",
        rating: 4.7,
        description: "13-inch laptop with Intel Core i7, 16GB RAM, 512GB SSD",
        category: "Electronics"
      },
      {
        name: "Adidas Running Shoes",
        price: 89.99,
        discountedPrice: 69.99,
        image: "/images/running-shoes.jpg",
        rating: 4.3,
        description: "Lightweight running shoes with responsive cushioning",
        category: "Footwear"
      },
      {
        name: "Dyson Air Purifier",
        price: 399.99,
        image: "/images/air-purifier.jpg",
        rating: 4.8,
        description: "HEPA air purifier with smart sensing and auto mode",
        category: "Appliances"
      },
      {
        name: "Nintendo Switch",
        price: 299.99,
        discountedPrice: 259.99,
        image: "/images/switch.jpg",
        rating: 4.9,
        description: "Gaming console that you can play at home or on the go",
        category: "Electronics"
      },
      {
        name: "Outdoor Sandals",
        price: 49.99,
        image: "/images/sandals.jpg",
        rating: 4.2,
        description: "Comfortable sandals perfect for summer",
        category: "Footwear"
      },
      {
        name: "Coffee Maker",
        price: 149.99,
        discountedPrice: 119.99,
        image: "/images/coffee-maker.jpg",
        rating: 4.6,
        description: "Programmable coffee maker with thermal carafe",
        category: "Appliances"
      },
      {
        name: "Hot Wheels Set",
        price: 29.99,
        image: "/images/hot-wheels.jpg",
        rating: 4.4,
        description: "20-piece Hot Wheels car collection with track",
        category: "Toys"
      },
      {
        name: "Smart Watch",
        price: 199.99,
        discountedPrice: 159.99,
        image: "/images/smartwatch.jpg",
        rating: 4.5,
        description: "Fitness tracking smartwatch with heart rate monitor",
        category: "Electronics"
      },
      {
        name: "Robot Vacuum",
        price: 299.99,
        discountedPrice: 249.99,
        image: "/images/robot-vacuum.jpg",
        rating: 4.3,
        description: "Smart robot vacuum with mapping technology",
        category: "Appliances"
      },
      {
        name: "Basketball",
        price: 24.99,
        image: "/images/basketball.jpg",
        rating: 4.6,
        description: "Official size basketball for indoor/outdoor use",
        category: "Toys"
      },
      {
        name: "Wireless Earbuds",
        price: 149.99,
        discountedPrice: 129.99,
        image: "/images/earbuds.jpg",
        rating: 4.7,
        description: "True wireless earbuds with noise cancellation",
        category: "Electronics"
      },
      {
        name: "Work Boots",
        price: 119.99,
        image: "/images/work-boots.jpg",
        rating: 4.4,
        description: "Steel-toe work boots with water resistance",
        category: "Footwear"
      },
      {
        name: "Air Fryer",
        price: 129.99,
        discountedPrice: 99.99,
        image: "/images/air-fryer.jpg",
        rating: 4.8,
        description: "Digital air fryer with multiple cooking presets",
        category: "Appliances"
      },
      {
        name: "Board Game Set",
        price: 39.99,
        discountedPrice: 29.99,
        image: "/images/board-games.jpg",
        rating: 4.5,
        description: "Collection of classic family board games",
        category: "Toys"
      },
      {
        name: "Gaming Mouse",
        price: 79.99,
        discountedPrice: 59.99,
        image: "/images/gaming-mouse.jpg",
        rating: 4.6,
        description: "RGB gaming mouse with programmable buttons",
        category: "Electronics"
      },
      {
        name: "Yoga Mat Set",
        price: 45.99,
        discountedPrice: 35.99,
        image: "/images/yoga-mat.jpg",
        rating: 4.7,
        description: "Premium yoga mat with blocks and strap",
        category: "Sports"
      },
      {
        name: "Smart Doorbell",
        price: 169.99,
        image: "/images/doorbell.jpg",
        rating: 4.6,
        description: "HD video doorbell with two-way audio and motion detection",
        category: "Electronics"
      },
      {
        name: "Baby Stroller",
        price: 249.99,
        discountedPrice: 199.99,
        image: "/images/stroller.jpg",
        rating: 4.8,
        description: "Convertible baby stroller with multiple reclining positions",
        category: "Baby"
      }
    ]
  });

  console.log('✅ Products seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
