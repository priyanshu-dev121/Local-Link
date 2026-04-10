const Booking = require('../Models/booking');
const Service = require('../Models/service');
const transporter = require('../Config/mailer');

// 👉 Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { service, date, address, coordinates } = req.body;
    
    // 1. Create the booking in DB
    const booking = await Booking.create({
      user: req.user._id,
      service,
      date,
      address,
      coordinates
    });

    // 2. Fetch full details for email
    const fullBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate({
        path: 'service',
        populate: { path: 'provider', select: 'name email businessName' }
      });

    // 3. Send Emails (Receipt)
    const receiptHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #ffffff; padding: 40px; border-radius: 24px; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #ff6b35; margin: 0; font-size: 28px; letter-spacing: -1px;">LocalLink <span style="font-weight: 300; font-style: italic;">Receipt</span></h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Order ID: ${fullBooking._id}</p>
        </div>

        <div style="background: #1e293b; padding: 32px; border-radius: 20px; border: 1px solid #334155; margin-bottom: 30px;">
          <h2 style="color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 24px;">Service Confirmed</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #94a3b8;">Service:</span>
            <span style="color: #ffffff; font-weight: bold;">${fullBooking.service.title}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #94a3b8;">Expert:</span>
            <span style="color: #ffffff; font-weight: bold;">${fullBooking.service.provider.name} (${fullBooking.service.provider.businessName || 'Pro'})</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #94a3b8;">Date:</span>
            <span style="color: #ffffff; font-weight: bold;">${new Date(fullBooking.date).toLocaleString()}</span>
          </div>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;">
          <div style="display: flex; justify-content: space-between; font-size: 24px;">
            <span style="color: #ffffff; font-weight: 900;">Total Paid:</span>
            <span style="color: #ff6b35; font-weight: 900;">₹${fullBooking.service.price + 29}</span>
          </div>
        </div>

        <div style="padding: 20px; background: rgba(255,107,53,0.1); border-radius: 16px; border: 1px solid rgba(255,107,53,0.2);">
          <p style="color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Service Location</p>
          <p style="color: #ffffff; margin: 0; font-weight: 500;">${fullBooking.address}</p>
        </div>

        <p style="color: #64748b; font-size: 12px; margin-top: 40px; text-align: center;">
          Thank you for choosing LocalLink. Our expert will arrive as scheduled.
        </p>
      </div>
    `;

    // Send to User
    await transporter.sendMail({
      from: '"LocalLink Bookings 🚀" <' + process.env.EMAIL_USER + '>',
      to: fullBooking.user.email,
      subject: "Booking Confirmed! Your LocalLink Receipt",
      html: receiptHtml
    });

    // Send to Provider
    await transporter.sendMail({
      from: '"LocalLink New Job! 🔔" <' + process.env.EMAIL_USER + '>',
      to: fullBooking.service.provider.email,
      subject: "Action Required: New Service Booking Received",
      html: receiptHtml.replace("Service Confirmed", "New Job Request").replace("Service Location", "Customer Location")
    });

    res.status(201).json(fullBooking);
  } catch (error) {
    console.error("Booking Error:", error);
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
        .populate({
            path: 'service',
            populate: { path: 'provider', select: 'name businessName coordinates image' }
        })
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ user: req.user._id })
        .populate('user', 'name email')
        .populate({
            path: 'service',
            populate: { path: 'provider', select: 'name businessName coordinates' }
        })
        .sort({ createdAt: -1 });
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

// 👉 Submit Review
exports.submitReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the user who made the booking can review it
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to review this booking" });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: "Can only review completed bookings" });
    }

    booking.review = {
      text,
      rating,
      createdAt: new Date()
    };

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};