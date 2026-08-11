const db = require('../database/db');

console.log('--- TESTING LIVE BUG FIX: OVERLAPPING LEAVE PREVENTION ---');

try {
  const emp = db.findUserByEmail('employee@office.com') || db.getAllUsers()[0];
  console.log('Testing with User:', emp.name, 'ID:', emp.id);

  // 1. Submit initial leave request (Sept 10 - Sept 15)
  const leave1 = db.createLeaveRequest(emp.id, {
    type: 'Casual Leave (CL)',
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    reason: 'Vacation'
  });
  console.log('✅ Created Initial Leave:', leave1.id, `${leave1.startDate} to ${leave1.endDate}`);

  // 2. Attempt overlapping leave request (Sept 12 - Sept 18)
  try {
    db.createLeaveRequest(emp.id, {
      type: 'Sick Leave (SL)',
      startDate: '2026-09-12',
      endDate: '2026-09-18',
      reason: 'Overlapping request'
    });
    console.log('❌ TEST FAILED: Overlapping leave was improperly allowed!');
  } catch (overlapErr) {
    console.log('✅ LIVE BUG FIX VERIFIED: Overlapping leave blocked successfully!');
    console.log('Caught Error Message:', overlapErr.message);
  }

} catch (err) {
  console.error('Error during test:', err.message);
}
