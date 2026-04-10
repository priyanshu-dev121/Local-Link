const express = require('express');
const router = express.Router();

const { signup, login, verifyOtp, forgotPassword, resetPassword } = require('../Controllers/authcontroller');

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;