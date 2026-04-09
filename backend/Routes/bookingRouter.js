const express = require('express');
const router = express.Router();
const protect = require('../Middleware/authmiddleware');
const {
  createBooking,
  getBookings,
  updateBookingStatus
} = require('../Controllers/bookingcontroller');

router.post('/',protect, createBooking);
router.get('/',protect,getBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
