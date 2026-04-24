const jwt = require('jsonwebtoken');
const redis = require('../redis');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const stored = await redis.get(`session:${decoded.userId}`);
  if (stored !== token) return res.status(401).json({ error: 'Session expired' });
  req.userId = decoded.userId;
  next();
};