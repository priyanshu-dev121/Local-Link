const Booking = require('../Models/booking');
const Service = require('../Models/service');

// 👉 Create Booking
exports.createBooking = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 👉 Get All Bookings
exports.getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'provider') {
      const myServices = await Service.find({ provider: req.user._id }).select('_id');
      bookings = await Booking.find({ service: { $in: myServices } })
        .populate('user', 'name email')
        .populate('service', 'title category price');
    } else {
      bookings = await Booking.find({ user: req.user._id })
        .populate('user', 'name email')
        .populate('service', 'title category price');
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👉 Update Booking Status
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Check if user is provider (optional security step)
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: "Only providers can update status" });
    }

    booking.status = req.body.status; // 'accepted' or 'rejected'
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};