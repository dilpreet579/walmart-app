const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get current user's cart (with items and product details)
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// Add product to cart
exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
    // Check if item exists
    let item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (item) {
      item = await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: item.quantity + (quantity || 1) }
      });
    } else {
      item = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: quantity || 1 }
      });
    }
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });
    res.status(201).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// Update quantity of a cart item
exports.updateQuantity = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { itemId, quantity } = req.body;
    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;
    await prisma.cartItem.delete({ where: { id: itemId } });
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
