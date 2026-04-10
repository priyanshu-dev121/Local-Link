const User = require('../Models/user');

// 👉 CREATE USER (Signup)
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 👉 GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👉 GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👉 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { businessName, experience, bio, image } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { businessName, experience, bio, image },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};