const db = require('../database/db');

console.log('--- TESTING ADMIN PROTECTION GUARD ---');
try {
  const sahil = db.findUserByEmail('sahil@gmail.com');
  console.log('Attempting to delete sahil@gmail.com...');
  db.deleteUser(sahil.id);
  console.log('❌ UNEXPECTED: sahil@gmail.com was deleted!');
} catch (err) {
  console.log('✅ SUCCESS! Protection Guard Blocked Deletion:');
  console.log(err.message);
}
