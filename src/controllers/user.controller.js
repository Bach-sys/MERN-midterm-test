const User = require('../models/user.model');
const { buildApiKey, generateRandom } = require('../utils/apiKey');

// POST /users/register
const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body || {};
    const missing = ['userName', 'email', 'password'].filter((f) => !req.body?.[f]);
    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    const existed = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existed) return res.status(409).json({ message: 'Email already exists' });

    const user = await User.create({ userName, email, password });
    res.status(201).json({ message: 'Register successfully', data: user });
  } catch (err) {
    next(err);
  }
};

// POST /users/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await user.comparePassword(String(password));
    if (!ok) return res.status(401).json({ message: 'Wrong password' });

    // Mỗi lần đăng nhập sinh randomstring mới -> apiKey cũ mất hiệu lực
    const random = generateRandom();
    user.apiKeySecret = random;
    await user.save();

    const apiKey = buildApiKey(user._id.toString(), user.email, random);
    res.status(200).json({ message: 'Login successfully', data: { apiKey } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
