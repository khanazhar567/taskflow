/**
 * Run this script once to create the default admin account.
 * Usage: node scripts/createAdmin.js
 *
 * NOTE: Do NOT pre-hash the password here. The User model's pre('save')
 * hook handles hashing automatically. Passing an already-hashed password
 * would cause it to be double-hashed, breaking login.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

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

  // Remove any broken existing admin so we can recreate it cleanly
  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    await existing.deleteOne();
    console.log('Removed previous admin entry (was double-hashed — fixing now)');
  }

  // Pass plain-text password — the pre('save') hook hashes it exactly once
  await User.create({
    name: ADMIN.name,
    email: ADMIN.email,
    password: ADMIN.password,
    role: ADMIN.role,
  });

  console.log('✅ Admin account created successfully:');
  console.log(`   Email   : ${ADMIN.email}`);
  console.log(`   Password: ${ADMIN.password}`);
  console.log('\nYou can now log in and use the Admin Panel.');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
