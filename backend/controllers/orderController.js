const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Create a new order from user's cart
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.userId
    const { addressId, paymentIntentId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent is required' })
    }

    // Get the cart with products
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    })

    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    // Calculate the order total
    const total = cart.items.reduce((sum, item) => {
      const price = item.product.discountedPrice ?? item.product.price
      return sum + price * item.quantity
    }, 0)

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        paymentIntentId,
        total,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.discountedPrice ?? item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    // Clear the cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
}

// Get all orders for the current user
exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.userId

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })

    res.json(orders)
  } catch (error) {
    next(error)
  }
}

// Get single order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const userId = req.userId
    const id = parseInt(req.params.id)

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    })

    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
}
