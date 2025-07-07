require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow all cross-origin requests
app.use(helmet());

// Basic health check route
app.get('/', (req, res) => {
  res.send('Walmart Clone Backend API is running');
});

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');
const addressRoutes = require('./routes/address');
const captchaRoutes = require('./routes/captcha');
const errorHandler = require('./middleware/errorHandler');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/captcha', captchaRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
