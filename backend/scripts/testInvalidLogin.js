const http = require('http');

const data = JSON.stringify({
  email: 'nonexistentuser999@gmail.com',
  password: 'wrongpassword'
});

const options = {
  hostname: 'localhost',
  port: 5050,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', body);
    const parsed = JSON.parse(body);
    if (parsed.message === 'Invalid ID and password.') {
      console.log('✅ TEST PASSED: Response returned "Invalid ID and password."');
    } else {
      console.log('❌ TEST FAILED: Unexpected response message');
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
