const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  date: {
    type: Date,
    required: true
  },
  review: {
    text: String,
    rating: { type: Number, min: 1, max: 5 },
    createdAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);