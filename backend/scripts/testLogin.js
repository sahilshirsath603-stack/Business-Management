const http = require('http');

const data = JSON.stringify({ email: 'sahil@gmail.com', password: 'Password' });

const req = http.request({
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('STATUS CODE:', res.statusCode);
    console.log('BODY:', body);
  });
});

req.on('error', err => console.error('HTTP ERROR:', err.message));
req.write(data);
req.end();
