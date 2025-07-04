const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require auth
router.use(authMiddleware);

// POST /api/payment/intent
router.post('/intent', paymentController.createPaymentIntent);

module.exports = router;
