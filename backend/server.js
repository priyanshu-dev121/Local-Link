const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// load environment variables
require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const connectDB = require('./Config/db');

// app init
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for production security
    methods: ["GET", "POST"]
  }
});

// connect to DB
connectDB();

const errorHandler = require('./Middleware/errormiddleware');

// middleware
app.use(express.json()); // to read JSON data
app.use(cors()); // allow frontend requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('⚡ New user connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    // data: { roomId, sender, text, timestamp }
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// health check
app.get('/', (req, res) => {
  res.send('LocalLink API with Real-time Support is running 🚀');
});

// routes
app.use('/api/auth', require('./Routes/authRouter'));
app.use('/api/users', require('./Routes/userRouter'));
app.use('/api/services', require('./Routes/serviceRouter'));
app.use('/api/bookings', require('./Routes/bookingRouter'));
app.use('/api/upload', require('./Routes/uploadRouter'));

app.use(errorHandler);

// server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});