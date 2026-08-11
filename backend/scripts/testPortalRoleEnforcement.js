const http = require('http');

const testLogin = (email, password, requiredRole, expectedStatus, label) => {
  return new Promise((resolve) => {
    const data = JSON.stringify({ email, password, requiredRole });
    const req = http.request({
      hostname: 'localhost',
      port: 5050,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        console.log(`[TEST] ${label}: Status ${res.statusCode} -> ${body}`);
        const parsed = JSON.parse(body);
        if (res.statusCode === expectedStatus) {
          console.log(`✓ PASSED`);
        } else {
          console.log(`❌ FAILED`);
        }
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
};

async function runTests() {
  console.log('--- TESTING STRICT PORTAL ROLE ENFORCEMENT ---');
  // 1. Admin account trying to log into Employee Portal -> Should fail (403)
  await testLogin('sahil@gmail.com', 'Password', 'employee', 403, 'Admin logging into Employee Portal');
  
  // 2. Manager account trying to log into Employee Portal -> Should fail (403)
  await testLogin('manager@office.com', 'manager123', 'employee', 403, 'Manager logging into Employee Portal');

  // 3. Employee account logging into Employee Portal -> Should succeed (200)
  await testLogin('employee@office.com', 'employee123', 'employee', 200, 'Employee logging into Employee Portal');

  // 4. Admin account logging into Admin Portal -> Should succeed (200)
  await testLogin('sahil@gmail.com', 'Password', 'admin', 200, 'Admin logging into Admin Portal');
}

runTests();
