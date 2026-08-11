const API_BASE_URL = 'http://localhost:5050/api';

const getHeaders = () => {
  const token = localStorage.getItem('oms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('oms_token');
      localStorage.removeItem('oms_user');
    }
    throw new Error(data.message || 'An unexpected server error occurred.');
  }
  return data;
};

export const api = {
  // Auth
  login: async (email, password, requiredRole) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, requiredRole })
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch (e) {}
    localStorage.removeItem('oms_token');
    localStorage.removeItem('oms_user');
  },

  // Access Requests & Approval
  getPendingAccessRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/users/pending-access`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateAccessRequest: async (userId, action) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/access`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ action })
    });
    return handleResponse(res);
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  markNotificationRead: async (id) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Attendance
  getTodayAttendance: async () => {
    const res = await fetch(`${API_BASE_URL}/attendance/today`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  clockIn: async (notes = '') => {
    const res = await fetch(`${API_BASE_URL}/attendance/clock-in`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes })
    });
    return handleResponse(res);
  },

  clockOut: async () => {
    const res = await fetch(`${API_BASE_URL}/attendance/clock-out`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getMyAttendanceLogs: async () => {
    const res = await fetch(`${API_BASE_URL}/attendance/my-logs`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getTeamAttendance: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/attendance/team?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getAllAttendance: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/attendance/all?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Leaves
  applyLeave: async (leaveData) => {
    const res = await fetch(`${API_BASE_URL}/leaves/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leaveData)
    });
    return handleResponse(res);
  },

  getMyLeaveRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/leaves/my-requests`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getTeamLeaveRequests: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/leaves/team-requests?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getAllLeaveRequests: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/leaves/all?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateLeaveStatus: async (id, status, comment = '') => {
    const res = await fetch(`${API_BASE_URL}/leaves/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, comment })
    });
    return handleResponse(res);
  },

  // Users (Admin Only)
  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createUser: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  updateUser: async (id, updates) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  deleteUser: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Stats
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/stats/dashboard`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
