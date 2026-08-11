const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'data.json');
const PROTECTED_ADMIN_EMAIL = 'sahil@gmail.com';

// Initial seed data
const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  
  const sahilPasswordHash = bcrypt.hashSync('Password', salt);
  const managerPasswordHash = bcrypt.hashSync('manager123', salt);
  const employee1PasswordHash = bcrypt.hashSync('employee123', salt);

  const todayStr = new Date().toISOString().split('T')[0];

  return {
    users: [
      {
        id: 'u-admin-sahil',
        name: 'Sahil Admin',
        email: PROTECTED_ADMIN_EMAIL,
        password: sahilPasswordHash,
        role: 'admin',
        department: 'Management',
        designation: 'Super System Administrator',
        reportsTo: null,
        status: 'active',
        isProtected: true,
        createdAt: '2026-01-01'
      },
      {
        id: 'u-2',
        name: 'David Miller',
        email: 'manager@office.com',
        password: managerPasswordHash,
        role: 'manager',
        department: 'Marketing',
        designation: 'Social Media Manager',
        reportsTo: 'u-admin-sahil',
        status: 'active',
        createdAt: '2026-01-05'
      },
      {
        id: 'u-3',
        name: 'Alex Johnson',
        email: 'employee@office.com',
        password: employee1PasswordHash,
        role: 'employee',
        department: 'Engineering',
        designation: 'Web Developer',
        reportsTo: 'u-2',
        status: 'active',
        createdAt: '2026-01-10'
      }
    ],
    attendance: [
      {
        id: 'att-1',
        userId: 'u-3',
        userName: 'Alex Johnson',
        userRole: 'employee',
        department: 'Engineering',
        date: todayStr,
        clockIn: '09:00 AM',
        clockOut: null,
        status: 'present',
        workHours: 0,
        notes: 'Remote working'
      },
      {
        id: 'att-2',
        userId: 'u-2',
        userName: 'David Miller',
        userRole: 'manager',
        department: 'Marketing',
        date: todayStr,
        clockIn: '08:45 AM',
        clockOut: null,
        status: 'present',
        workHours: 0,
        notes: 'In Office'
      }
    ],
    leaves: [
      {
        id: 'lv-1',
        userId: 'u-3',
        userName: 'Alex Johnson',
        department: 'Engineering',
        type: 'Sick Leave (SL)',
        startDate: '2026-08-15',
        endDate: '2026-08-16',
        days: 2,
        reason: 'Medical checkup and recovery',
        status: 'pending',
        appliedOn: '2026-08-08',
        comment: ''
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        recipientId: 'u-admin-sahil',
        title: 'Blen Digital System Active',
        message: 'Blen Digital Digital Marketing Agency system is fully operational.',
        type: 'system_announcement',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ],
    leaveBalances: {
      'u-admin-sahil': { casual: 12, sick: 10, annual: 15 },
      'u-2': { casual: 12, sick: 10, annual: 15 },
      'u-3': { casual: 12, sick: 10, annual: 15 }
    }
  };
};

class Database {
  constructor() {
    this.ensureDir();
    this.data = this.load();
  }

  ensureDir() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  load() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initial = getInitialData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
        return initial;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (!parsed.notifications) parsed.notifications = [];
      if (!parsed.leaveBalances) parsed.leaveBalances = {};
      return parsed;
    } catch (err) {
      console.error('Failed to load database, creating fresh copy:', err.message);
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error('Failed to save database:', err.message);
    }
  }

  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    if (!id) return null;
    const idStr = String(id);
    return this.data.users.find(u => String(u.id) === idStr || String(u._id) === idStr);
  }

  getAllUsers() {
    return this.data.users.map(({ password, ...u }) => {
      const manager = u.reportsTo ? this.findUserById(u.reportsTo) : null;
      const leaveBalance = this.getLeaveBalance(u.id || u._id);
      return {
        ...u,
        managerName: manager ? manager.name : 'None',
        leaveBalance,
        isProtected: u.email.toLowerCase() === PROTECTED_ADMIN_EMAIL
      };
    });
  }

  registerUser(userData) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);
    
    let managerId = null;
    if (userData.role === 'employee') {
      const deptManager = this.data.users.find(u => u.role === 'manager' && u.department === userData.department);
      if (deptManager) managerId = deptManager.id;
    }

    const newUser = {
      id: 'u-' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'employee',
      department: userData.department || 'Engineering',
      designation: userData.designation || (userData.role === 'manager' ? 'Social Media Manager' : 'Web Developer'),
      reportsTo: managerId,
      status: 'pending_approval',
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.data.users.push(newUser);
    this.data.leaveBalances[newUser.id] = { casual: 12, sick: 10, annual: 15 };

    if (newUser.role === 'employee') {
      const managers = this.data.users.filter(u => u.role === 'manager' && u.department === newUser.department);
      managers.forEach(m => {
        this.addNotification({
          recipientId: m.id,
          title: 'New Employee Access Request',
          message: `${newUser.name} (${newUser.email}) has registered for ${newUser.department} as ${newUser.designation} and needs your approval.`,
          type: 'access_request',
          relatedId: newUser.id
        });
      });
    } else if (newUser.role === 'manager') {
      const admins = this.data.users.filter(u => u.role === 'admin');
      admins.forEach(a => {
        this.addNotification({
          recipientId: a.id,
          title: 'New Manager Access Request',
          message: `${newUser.name} (${newUser.email}) requested Manager level access (${newUser.designation}) for ${newUser.department}.`,
          type: 'access_request',
          relatedId: newUser.id
        });
      });
    }

    this.save();
    const { password, ...userPayload } = newUser;
    return userPayload;
  }

  getPendingAccessRequests({ role, department }) {
    let pending = this.data.users.filter(u => u.status === 'pending_approval');
    if (role) pending = pending.filter(u => u.role === role);
    if (department) pending = pending.filter(u => u.department === department);
    return pending.map(({ password, ...u }) => u);
  }

  approveAccess(userId, reviewer) {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User account not found');

    user.status = 'active';

    this.addNotification({
      recipientId: user.id,
      title: 'Account Access Approved! 🎉',
      message: `Your account access request has been approved by ${reviewer.name}. Welcome to Blen Digital!`,
      type: 'access_approved',
      relatedId: user.id
    });

    this.save();
    const { password, ...userPayload } = user;
    return userPayload;
  }

  declineAccess(userId, reviewer) {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User account not found');

    user.status = 'rejected';

    this.addNotification({
      recipientId: user.id,
      title: 'Access Request Declined',
      message: `Your account request was declined by ${reviewer.name}. Please contact Blen Digital administrator.`,
      type: 'access_declined',
      relatedId: user.id
    });

    this.save();
    const { password, ...userPayload } = user;
    return userPayload;
  }

  addNotification({ recipientId, title, message, type, relatedId }) {
    const notif = {
      id: 'notif-' + Date.now() + Math.floor(Math.random() * 100),
      recipientId: String(recipientId),
      title,
      message,
      type: type || 'system_announcement',
      relatedId: relatedId || null,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(notif);
    this.save();
    return notif;
  }

  getUserNotifications(userId) {
    const uStr = String(userId);
    return (this.data.notifications || [])
      .filter(n => String(n.recipientId) === uStr)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  markNotificationAsRead(notifId, userId) {
    const uStr = String(userId);
    const nStr = String(notifId);
    const notif = (this.data.notifications || []).find(n => String(n.id) === nStr && String(n.recipientId) === uStr);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
    return notif;
  }

  createUser(userData) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);
    
    const newUser = {
      id: 'u-' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'employee',
      department: userData.department || 'General',
      designation: userData.designation || 'Web Developer',
      reportsTo: userData.reportsTo || null,
      status: userData.status || 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.data.users.push(newUser);
    this.data.leaveBalances[newUser.id] = { casual: 12, sick: 10, annual: 15 };
    this.save();
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  updateUser(id, updates) {
    const idStr = String(id);
    const idx = this.data.users.findIndex(u => String(u.id) === idStr || String(u._id) === idStr);
    if (idx === -1) return null;

    const targetUser = this.data.users[idx];

    // PROTECTED ADMIN GUARD
    if (targetUser.email.toLowerCase() === PROTECTED_ADMIN_EMAIL) {
      if (updates.status && updates.status !== 'active') {
        throw new Error('System Protected Error: Primary Admin sahil@gmail.com cannot be deactivated.');
      }
      if (updates.role && updates.role !== 'admin') {
        throw new Error('System Protected Error: Primary Admin sahil@gmail.com role cannot be changed.');
      }
    }

    if (updates.password) {
      const salt = bcrypt.genSaltSync(10);
      updates.password = bcrypt.hashSync(updates.password, salt);
    }

    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();

    const { password, ...userWithoutPassword } = this.data.users[idx];
    return userWithoutPassword;
  }

  deleteUser(id) {
    const idStr = String(id);
    const targetUser = this.findUserById(id);
    if (targetUser && targetUser.email.toLowerCase() === PROTECTED_ADMIN_EMAIL) {
      throw new Error('System Protected Error: The primary Super Admin account (sahil@gmail.com) is permanently protected and cannot be deleted.');
    }

    this.data.users = this.data.users.filter(u => String(u.id) !== idStr && String(u._id) !== idStr);
    delete this.data.leaveBalances[id];
    this.save();
    return true;
  }

  getAttendanceLogs({ userId, department, date }) {
    let logs = [...this.data.attendance];
    if (userId) {
      const uStr = String(userId);
      logs = logs.filter(l => String(l.userId) === uStr || String(l.user) === uStr);
    }
    if (department) logs = logs.filter(l => l.department === department);
    if (date) logs = logs.filter(l => l.date === date);
    return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getTodayAttendanceForUser(userId) {
    const uStr = String(userId);
    const todayStr = new Date().toISOString().split('T')[0];
    return this.data.attendance.find(a => (String(a.userId) === uStr || String(a.user) === uStr) && a.date === todayStr);
  }

  clockIn(userId, notes = '') {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    const todayStr = new Date().toISOString().split('T')[0];
    const uStr = String(userId);
    const existing = this.data.attendance.find(a => (String(a.userId) === uStr || String(a.user) === uStr) && a.date === todayStr);

    if (existing) {
      throw new Error('Already clocked in for today');
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const isLate = now.getHours() > 10 || (now.getHours() === 10 && now.getMinutes() > 15);

    const log = {
      id: 'att-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      department: user.department,
      date: todayStr,
      clockIn: timeStr,
      clockOut: null,
      status: isLate ? 'late' : 'present',
      workHours: 0,
      notes: notes || 'Normal Check-in'
    };

    this.data.attendance.unshift(log);
    this.save();
    return log;
  }

  clockOut(userId) {
    const todayStr = new Date().toISOString().split('T')[0];
    const uStr = String(userId);
    const existing = this.data.attendance.find(a => (String(a.userId) === uStr || String(a.user) === uStr) && a.date === todayStr);

    if (!existing) {
      throw new Error('No active clock-in found for today');
    }

    if (existing.clockOut) {
      throw new Error('Already clocked out today');
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    existing.clockOut = timeStr;
    existing.workHours = 7;

    this.save();
    return existing;
  }

  getLeaveRequests({ userId, department, status }) {
    let list = [...this.data.leaves];
    if (userId) {
      const uStr = String(userId);
      list = list.filter(l => String(l.userId) === uStr || String(l.user) === uStr);
    }
    if (department) {
      list = list.filter(l => l.department === department);
    }
    if (status) {
      list = list.filter(l => l.status === status);
    }
    return list.sort((a, b) => new Date(b.appliedOn || b.startDate) - new Date(a.appliedOn || a.startDate));
  }

  getLeaveBalance(userId) {
    const uStr = String(userId);
    return this.data.leaveBalances[uStr] || this.data.leaveBalances[userId] || { casual: 12, sick: 10, annual: 15 };
  }

  createLeaveRequest(userId, { type, startDate, endDate, reason }) {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid start or end date provided.');
    }

    if (end < start) {
      throw new Error('Leave End Date cannot be before Start Date.');
    }

    const uStr = String(userId);
    // Overlapping Leave Validation: startA <= endB && endA >= startB
    const hasOverlap = this.data.leaves.some(l => {
      const isSameUser = String(l.userId) === uStr || String(l.user) === uStr;
      if (!isSameUser || l.status === 'rejected') return false;
      const existingStart = new Date(l.startDate);
      const existingEnd = new Date(l.endDate);
      return start <= existingEnd && end >= existingStart;
    });

    if (hasOverlap) {
      throw new Error(`Overlapping Leave Error: You already have an active or approved leave request during ${startDate} to ${endDate}.`);
    }

    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    const newLeave = {
      id: 'lv-' + Date.now(),
      userId: user.id,
      userName: user.name,
      department: user.department,
      type,
      startDate,
      endDate,
      days,
      reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      comment: ''
    };

    this.data.leaves.unshift(newLeave);

    const managers = this.data.users.filter(u => u.role === 'manager' && u.department === user.department);
    managers.forEach(m => {
      this.addNotification({
        recipientId: m.id,
        title: 'New Leave Request',
        message: `${user.name} submitted a ${type} request for ${days} days (${startDate} to ${endDate}).`,
        type: 'leave_applied',
        relatedId: newLeave.id
      });
    });

    this.save();
    return newLeave;
  }

  updateLeaveStatus(leaveId, status, comment = '') {
    const lStr = String(leaveId);
    const idx = this.data.leaves.findIndex(l => String(l.id) === lStr || String(l._id) === lStr);
    if (idx === -1) throw new Error('Leave request not found');

    const leave = this.data.leaves[idx];
    leave.status = status;
    leave.comment = comment || (status === 'approved' ? 'Approved by Manager' : 'Declined');
    this.data.leaves[idx] = { ...leave };

    const targetUserId = leave.userId || leave.user;
    if (status === 'approved') {
      const balance = this.getLeaveBalance(targetUserId);
      const key = leave.type.toLowerCase().includes('sick') ? 'sick' : 
                  leave.type.toLowerCase().includes('casual') ? 'casual' : 'annual';
      if (balance[key] !== undefined) {
        balance[key] = Math.max(0, balance[key] - leave.days);
        this.data.leaveBalances[String(targetUserId)] = balance;
      }
    }

    this.addNotification({
      recipientId: targetUserId,
      title: `Leave Request ${status.toUpperCase()}`,
      message: `Your ${leave.type} request from ${leave.startDate} to ${leave.endDate} was ${status}. Comment: ${leave.comment}`,
      type: status === 'approved' ? 'leave_approved' : 'leave_rejected',
      relatedId: leave.id || leave._id
    });

    this.save();
    return this.data.leaves[idx];
  }

  getStats(user) {
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (user.role === 'manager') {
      const uStr = String(user.id || user._id);
      const teamMembers = this.data.users.filter(u => u.department === user.department && u.role === 'employee' && String(u.id || u._id) !== uStr && u.status === 'active');
      const totalTeam = teamMembers.length;
      const todayLogs = this.data.attendance.filter(a => a.date === todayStr && a.department === user.department && String(a.userId) !== uStr && (a.userRole === 'employee' || !a.userRole));
      const presentToday = todayLogs.filter(l => l.status === 'present').length;
      const lateToday = todayLogs.filter(l => l.status === 'late').length;
      const absentToday = Math.max(0, totalTeam - (presentToday + lateToday));
      const pendingLeaves = this.data.leaves.filter(l => l.department === user.department && l.status === 'pending');
      const pendingAccess = this.getPendingAccessRequests({ role: 'employee', department: user.department });

      return {
        totalTeamMembers: totalTeam,
        presentToday,
        lateToday,
        absentToday,
        pendingLeavesCount: pendingLeaves.length,
        pendingAccessCount: pendingAccess.length,
        todayAttendance: todayLogs,
        pendingLeaves,
        pendingAccess
      };
    }

    const totalEmployees = this.data.users.filter(u => u.status === 'active').length;
    const todayLogs = this.data.attendance.filter(a => a.date === todayStr);
    const presentToday = todayLogs.filter(l => l.status === 'present').length;
    const lateToday = todayLogs.filter(l => l.status === 'late').length;
    const absentToday = Math.max(0, totalEmployees - (presentToday + lateToday));

    const pendingLeaves = this.data.leaves.filter(l => l.status === 'pending').length;
    const approvedLeaves = this.data.leaves.filter(l => l.status === 'approved').length;
    const rejectedLeaves = this.data.leaves.filter(l => l.status === 'rejected').length;

    const pendingManagerAccess = this.getPendingAccessRequests({ role: 'manager' });
    const pendingAllAccess = this.getPendingAccessRequests({});

    const departmentCounts = {};
    this.data.users.filter(u => u.status === 'active').forEach(u => {
      departmentCounts[u.department] = (departmentCounts[u.department] || 0) + 1;
    });

    const leaveTypesCount = { 'Casual Leave': 0, 'Sick Leave': 0, 'Earned Leave': 0 };
    this.data.leaves.forEach(l => {
      leaveTypesCount[l.type] = (leaveTypesCount[l.type] || 0) + 1;
    });

    return {
      totalEmployees,
      presentToday,
      lateToday,
      absentToday,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      pendingAccessCount: pendingAllAccess.length,
      pendingManagerAccessCount: pendingManagerAccess.length,
      pendingManagerAccess,
      departmentCounts,
      leaveTypesCount,
      monthlyAttendance: [
        { month: 'Apr', present: 85, late: 10, absent: 5 },
        { month: 'May', present: 88, late: 8, absent: 4 },
        { month: 'Jun', present: 92, late: 5, absent: 3 },
        { month: 'Jul', present: 90, late: 7, absent: 3 },
        { month: 'Aug', present: presentToday + lateToday, late: lateToday, absent: absentToday }
      ]
    };
  }
}

module.exports = new Database();
