const express = require('express');
const router = express.Router();

const { createUser, getUsers, getMe, updateProfile } = require('../Controllers/usercontroller');
const protect = require('../Middleware/authmiddleware');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;