const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: String,
    enum: [
      "electrician",
      "plumber",
      "delivery",
      "cleaning",
      "home tutor",
      "painter"
    ],
    lowercase: true,
    trim: true,
    required: true
  },

  price: Number,

  description: String,

  image: String   // ⭐ ADD THIS LINE

}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);