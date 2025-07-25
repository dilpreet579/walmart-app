const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Get a product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, image, discountedPrice, rating, description, category } = req.body;
    if (!name || price === undefined || !image || rating === undefined || !description || !category) {
      //console.log(req.body);
      return res.status(400).json({ message: 'All product fields are required.' });
    }
    const product = await prisma.product.create({
      data: { name, price, image, discountedPrice, rating, description, category }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, image, discountedPrice, rating, description, category } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, price, image, discountedPrice, rating, description, category }
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
