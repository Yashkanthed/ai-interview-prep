const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  console.log('MONGO_URI:', process.env.MONGO_URI);

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not found. Check your .env file.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'admin@aiinterview.dev' });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  await User.create({
    name: 'Admin',
    email: 'admin@aiinterview.dev',
    password: 'Admin@1234',
    role: 'admin',
    isEmailVerified: true,
    experienceLevel: '8+'
  });

  console.log('✅  Admin created — email: admin@aiinterview.dev  password: Admin@1234');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });