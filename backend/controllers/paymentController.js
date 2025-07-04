const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || !currency) return res.status(400).json({ message: 'Missing amount or currency' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};
