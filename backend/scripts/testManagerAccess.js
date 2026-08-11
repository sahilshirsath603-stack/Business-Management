const db = require('../database/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const http = require('http');

console.log('--- DEBUGGING MANAGER USER ROLE ---');

const manager = db.data.users.find(u => u.role === 'manager');
console.log('DB manager object:', manager);

const fetchedUser = db.findUserById(manager.id);
console.log('findUserById result:', fetchedUser);

// Check JWT Token
const token = jwt.sign(
  { id: manager.id, email: manager.email, role: manager.role },
  JWT_SECRET,
  { expiresIn: '24h' }
);

const options = {
  hostname: 'localhost',
  port: 5050,
  path: '/api/users',
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
    console.log('HTTP Response Status Code:', res.statusCode);
    console.log('HTTP Response Body:', body);
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.end();
