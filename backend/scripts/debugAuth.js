const bcrypt = require('bcryptjs');
const db = require('../database/db');

console.log('--- DEBUGGING AUTHENTICATION ---');

const testLogin = (email, plainPassword) => {
  const user = db.findUserByEmail(email);
  if (!user) {
    console.log(`❌ User NOT FOUND for email: ${email}`);
    return;
  }

  console.log(`Found user: ${user.name} (${user.email}) | Role: ${user.role} | Status: ${user.status}`);

  const isMatch = bcrypt.compareSync(plainPassword, user.password);
  console.log(`Password Match ('${plainPassword}'):`, isMatch ? '✅ MATCH!' : '❌ MISMATCH!');
};

console.log('\nTesting sahil@gmail.com with "Password":');
testLogin('sahil@gmail.com', 'Password');

console.log('\nTesting admin@office.com with "admin123":');
testLogin('admin@office.com', 'admin123');
