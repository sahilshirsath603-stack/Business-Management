const db = require('../database/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const http = require('http');

console.log('--- TESTING TEAM ATTENDANCE FILTER FOR MANAGER ---');

const manager = db.data.users.find(u => u.role === 'manager');
if (!manager) {
  console.error('No manager user found');
  process.exit(1);
}

const token = jwt.sign(
  { id: manager.id, email: manager.email, role: manager.role },
  JWT_SECRET,
  { expiresIn: '24h' }
);

const options = {
  hostname: 'localhost',
  port: 5050,
  path: '/api/attendance/team',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log('Returned Logs Count:', data.logs ? data.logs.length : 0);
    console.log('Returned Logs:', data.logs);

    const containsManager = data.logs.some(l => String(l.userId) === String(manager.id));
    if (containsManager) {
      console.log('❌ TEST FAILED: Manager attendance log is still present!');
    } else {
      console.log('✅ TEST PASSED: Manager attendance log excluded! Only team employee logs returned.');
    }
  });
});

req.on('error', (e) => console.error('Request Error:', e.message));
req.end();
