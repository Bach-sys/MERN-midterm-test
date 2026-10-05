const User = require('../models/user.model');
const { parseApiKey } = require('../utils/apiKey');

// Xác thực người dùng qua query ?apiKey=...
const authenticate = async (req, res, next) => {
  try {
    const { apiKey } = req.query;
    if (!apiKey) return res.status(401).json({ message: 'apiKey is required' });

    const parsed = parseApiKey(apiKey);
    if (!parsed) return res.status(401).json({ message: 'apiKey is invalid' });

    const user = await User.findById(parsed.userId).select('+apiKeySecret');
    if (!user) return res.status(401).json({ message: 'User of this apiKey does not exist' });

    if (user.email !== parsed.email.toLowerCase() || !user.apiKeySecret || user.apiKeySecret !== parsed.random) {
      return res.status(401).json({ message: 'apiKey is invalid or expired' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
