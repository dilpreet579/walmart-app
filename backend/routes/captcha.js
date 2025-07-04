const express = require('express');
const router = express.Router();
const captchaController = require('../controllers/captchaController');

// POST /api/captcha/verify
router.post('/verify', captchaController.verifyCaptcha);

module.exports = router;
