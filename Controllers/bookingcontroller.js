const Booking = require('../Models/booking');

// 👉 Create Booking
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 👉 Get All Bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'title category price');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};