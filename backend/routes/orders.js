const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require auth
router.use(authMiddleware);

// POST /api/orders (create order from cart)
router.post('/', orderController.createOrder);

// GET /api/orders (get user's orders)
router.get('/', orderController.getUserOrders);

// GET /api/orders/:id (get single order)
router.get('/:id', orderController.getOrderById);

module.exports = router;
