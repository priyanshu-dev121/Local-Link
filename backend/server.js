// load environment variables
require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const connectDB = require('./Config/db');
connectDB();
const errorHandler = require('./Middleware/errormiddleware');
// imports
const express = require('express');
const cors = require('cors');

// app init
const app = express();
const path = require('path');

// middleware
app.use(express.json()); // to read JSON data
app.use(cors()); // allow frontend requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// basic route (health check)
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});


// routes (connect later when you create them)
app.use('/api/auth', require('./Routes/authRouter'));
app.use('/api/users', require('./Routes/userRouter'));
app.use('/api/services', require('./Routes/serviceRouter'));
app.use('/api/bookings', require('./Routes/bookingRouter'));
app.use('/api/upload', require('./Routes/uploadRouter'));


app.use(errorHandler)
// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});