const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require auth
router.use(authMiddleware);

// GET /api/address
router.get('/', addressController.getAddresses);

// POST /api/address
router.post('/', addressController.addAddress);

// PUT /api/address/:id
router.put('/:id', addressController.updateAddress);

// DELETE /api/address/:id
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
