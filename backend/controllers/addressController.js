const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all addresses for current user
exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.userId;
    const addresses = await prisma.address.findMany({ where: { userId } });
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

// Add a new address
exports.addAddress = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { line1, city, zip, country, phone } = req.body;
    const address = await prisma.address.create({
      data: { userId, line1, city, zip, country, phone }
    });
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

// Update an address
exports.updateAddress = async (req, res, next) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    const { line1, city, zip, country, phone } = req.body;
    const address = await prisma.address.update({
      where: { id },
      data: { line1, city, zip, country, phone }
    });
    if (address.userId !== userId) return res.status(403).json({ message: 'Forbidden' });
    res.json(address);
  } catch (error) {
    next(error);
  }
};

// Delete an address
exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) return res.status(404).json({ message: 'Address not found' });
    await prisma.address.delete({ where: { id } });
    res.json({ message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};
