const db = require('../database/db');

console.log('--- TESTING DEACTIVATE & DELETE USER ACTIONS ---');

try {
  // 1. Create a dummy user to test
  const tempUser = db.createUser({
    name: 'Temporary Staff',
    email: 'temp@blendigital.com',
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    designation: 'Web Developer',
    status: 'active'
  });
  console.log('Created Temp User:', tempUser.id, tempUser.email, 'Status:', tempUser.status);

  // 2. Deactivate Temp User
  const deactivated = db.updateUser(tempUser.id, { status: 'deactivated' });
  console.log('Deactivated Temp User Status:', deactivated.status);

  // 3. Delete Temp User
  const deleted = db.deleteUser(tempUser.id);
  console.log('Deleted Temp User Result:', deleted);

  if (deactivated.status === 'deactivated' && deleted === true) {
    console.log('✅ SUCCESS: User Deactivation and Deletion logic verified!');
  } else {
    console.log('❌ FAILURE: Action did not complete as expected');
  }
} catch (err) {
  console.error('❌ ERROR:', err.message);
}
