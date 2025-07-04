const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require auth
router.use(authMiddleware);

// GET /api/cart
router.get('/', cartController.getCart);

// POST /api/cart/add
router.post('/add', cartController.addToCart);

// PUT /api/cart/update
router.put('/update', cartController.updateQuantity);

// DELETE /api/cart/remove
router.delete('/remove', cartController.removeFromCart);

// DELETE /api/cart/clear
router.delete('/clear', cartController.clearCart);

module.exports = router;
