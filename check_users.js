const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const User = require('./server/models/User');

async function checkUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({}, 'name email role');
  console.log('Current Users:', JSON.stringify(users, null, 2));
  await mongoose.disconnect();
}

checkUsers().catch(console.error);
