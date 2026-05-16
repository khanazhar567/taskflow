/**
 * Run this script once to create the default admin account.
 * Usage: node scripts/createAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ADMIN = {
  name: 'Admin',
  email: 'admin@taskflow.com',
  password: 'Admin@123',
  role: 'admin',
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const User = require('../models/User');

  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log(`Admin already exists: ${ADMIN.email}`);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(ADMIN.password, salt);

  await User.create({ name: ADMIN.name, email: ADMIN.email, password: hashed, role: ADMIN.role });

  console.log('✅ Admin account created:');
  console.log(`   Email   : ${ADMIN.email}`);
  console.log(`   Password: ${ADMIN.password}`);
  console.log('\nYou can now log in and use the Admin Panel.');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
