const axios = require('axios');

// Verify Google reCAPTCHA
exports.verifyCaptcha = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'No captcha token provided' });
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );
    if (response.data.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: response.data['error-codes'] });
    }
  } catch (error) {
    next(error);
  }
};
