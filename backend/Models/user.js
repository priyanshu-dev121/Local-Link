const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'provider'],
    default: 'customer'
  },
  phone: {
    type: String,
    required: false
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  businessName: {
    type: String,
    required: false
  },
  experience: {
    type: Number,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  trustedDevices: [{
    token: { type: String },
    expiresAt: { type: Date }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);