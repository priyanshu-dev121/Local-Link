const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./Models/user');
const Service = require('./Models/service');
const bcrypt = require('bcryptjs');
const connectDB = require('./Config/db');

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});

    // Create a Provider User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const provider = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password: hashedPassword,
      role: 'provider'
    });

    const customer = await User.create({
      name: 'Ananya R.',
      email: 'ananya@example.com',
      password: hashedPassword,
      role: 'customer'
    });

    console.log('✅ Users Created');

    // Create Services
    await Service.create({
      title: 'Pipe Repair & Installation',
      category: 'plumber',
      price: 499,
      description: 'Professional plumbing service for all your repair and installation needs.',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop',
      provider: provider._id
    });

    await Service.create({
      title: 'Home Wiring & Repair',
      category: 'electrician',
      price: 699,
      description: 'Expert electrical services ensuring safety and efficiency.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      provider: provider._id
    });

    console.log('✅ Services Created');
    process.exit();
  } catch (error) {
    console.error('❌ Error Seeding Data:', error);
    process.exit(1);
  }
};

seedData();
