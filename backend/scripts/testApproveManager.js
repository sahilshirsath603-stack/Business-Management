const db = require('../database/db');

console.log('--- TESTING NEW MANAGER REGISTRATION & APPROVAL ---');

try {
  // 1. Register new manager
  const regResult = db.registerUser({
    name: 'New Test Manager',
    email: 'newmanager@office.com',
    password: 'password123',
    role: 'manager',
    department: 'Marketing',
    designation: 'Marketing Manager'
  });
  console.log('Registered New Manager:', regResult.id, regResult.email, 'Status:', regResult.status);

  // 2. Admin approves manager access
  const admin = db.findUserByEmail('sahil@gmail.com');
  const approved = db.approveAccess(regResult.id, admin);
  console.log('Approved Manager Status:', approved.status);

  if (approved.status === 'active') {
    console.log('✅ SUCCESS: New Manager activated successfully!');
  } else {
    console.log('❌ FAILURE: Status not active');
  }
} catch (err) {
  console.error('❌ ERROR:', err.message);
}
