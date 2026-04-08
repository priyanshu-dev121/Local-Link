const express = require('express');
const router = express.Router();
const protect = require('../Middleware/authmiddleware');
const {
  createBooking,
  getBookings
} = require('../Controllers/bookingcontroller');

router.post('/',protect, createBooking);
router.get('/',protect,getBookings);

module.exports = router;
