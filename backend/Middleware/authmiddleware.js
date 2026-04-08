const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const protect = async (req, res, next) => {
  let token;

  try {
    // 👉 Check token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Bearer TOKEN
      token = req.headers.authorization.split(' ')[1];

      // 👉 Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👉 Get user from DB (without password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } else {
      res.status(401).json({ message: "No token, access denied" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = protect;