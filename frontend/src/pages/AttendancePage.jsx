import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, Search, Filter, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AttendancePage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const loadAttendance = async () => {
    try {
      setLoading(true);
      let res;
      if (user.role === 'admin') {
        res = await api.getAllAttendance({ date: dateFilter });
      } else if (user.role === 'manager') {
        res = await api.getTeamAttendance({ date: dateFilter });
      } else {
        res = await api.getMyAttendanceLogs();
      }
      setLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to load attendance logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [dateFilter, user]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName ? log.userName.toLowerCase().includes(searchTerm.toLowerCase()) || log.department.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Attendance Records & History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {user.role === 'admin' ? 'Company-Wide System Attendance Log' : user.role === 'manager' ? `Department Attendance Logs (${user.department})` : 'My Personal Check-in History'}
          </p>
        </div>
        <div className="status-pill present" style={{ padding: '0.5rem 1rem' }}>
          <CheckCircle2 size={16} /> Total Logs: {filteredLogs.length}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        {(user.role === 'admin' || user.role === 'manager') && (
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="glass-input"
              style={{ paddingLeft: '2.8rem' }}
              placeholder="Search by Employee or Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="glass-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="all" style={{ background: '#0f172a' }}>All Statuses</option>
            <option value="present" style={{ background: '#0f172a' }}>Present</option>
            <option value="late" style={{ background: '#0f172a' }}>Late</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} color="var(--text-muted)" />
          <input
            type="date"
            className="glass-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ width: '170px' }}
          />
        </div>

        {dateFilter && (
          <button onClick={() => setDateFilter('')} className="btn-secondary" style={{ padding: '0.6rem 0.9rem', fontSize: '0.82rem' }}>
            Clear Date
          </button>
        )}
      </div>

      {/* Attendance Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading attendance records...</p>
        ) : filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Clock size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p style={{ fontSize: '1rem', fontWeight: '600' }}>No attendance records match your filter criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{log.userName || user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{log.userRole || user.role}</div>
                    </td>
                    <td>{log.department || user.department}</td>
                    <td>{log.date}</td>
                    <td>{log.clockIn || '--'}</td>
                    <td>{log.clockOut || '--'}</td>
                    <td>
                      <span className={`status-pill ${log.status}`}>{log.status}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{log.notes || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
