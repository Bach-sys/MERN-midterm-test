const crypto = require('crypto');

// apiKey dạng: mern-$userId$-$email$-$randomstring$
const buildApiKey = (userId, email, random) => `mern-$${userId}$-$${email}$-$${random}$`;

const parseApiKey = (apiKey) => {
  const match = /^mern-\$([a-fA-F0-9]{24})\$-\$([^$]+)\$-\$([^$]+)\$$/.exec(apiKey || '');
  if (!match) return null;
  return { userId: match[1], email: match[2], random: match[3] };
};

const generateRandom = () => crypto.randomUUID();

module.exports = { buildApiKey, parseApiKey, generateRandom };
