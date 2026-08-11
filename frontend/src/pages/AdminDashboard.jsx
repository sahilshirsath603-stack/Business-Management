import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserModal } from '../components/UserModal';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { Users, ShieldCheck, Building2, CalendarCheck, UserPlus, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowUpRight, Check, X, ShieldAlert } from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingManagerRequests, setPendingManagerRequests] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, pendingRes] = await Promise.all([
        api.getDashboardStats(),
        api.getUsers(),
        api.getPendingAccessRequests()
      ]);
      setStats(statsRes.stats);
      setUsers(usersRes.users || []);
      setPendingManagerRequests(pendingRes.pending || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccessAction = async (userId, action) => {
    if (!userId) {
      showToast('Error: Invalid user identifier.', 'error');
      return;
    }
    setActionId(userId);
    try {
      const res = await api.updateAccessRequest(userId, action);
      showToast(res.message, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Header Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <span className="role-pill admin">Super Admin Console</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete System Privilege</span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
          System Executive Hub & Access Control
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.92rem' }}>
          Review pending manager access requests, analyze company attendance trends, and configure system permissions.
        </p>
      </div>

      {/* NEW MANAGER & STAFF ACCESS APPROVAL REQUESTS CARD */}
      {pendingManagerRequests.length > 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.5)', background: 'rgba(236, 72, 153, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <ShieldAlert size={22} color="#ec4899" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ec4899' }}>
                Pending Manager & Staff Access Approvals ({pendingManagerRequests.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                The following users requested access credentials and require Super Admin authorization:
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email Address</th>
                  <th>Requested Role</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingManagerRequests.map(req => {
                  const targetId = req.id || req._id;
                  return (
                    <tr key={targetId}>
                      <td>
                        <span style={{ fontWeight: '700' }}>{req.name}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.email}</td>
                      <td>
                        <span className={`role-pill ${req.role}`}>{req.role}</span>
                      </td>
                      <td>{req.department}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{req.createdAt}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleAccessAction(targetId, 'approve')}
                            disabled={actionId === targetId}
                            className="btn-success"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          >
                            <Check size={14} /> Grant Access
                          </button>
                          <button
                            onClick={() => handleAccessAction(targetId, 'decline')}
                            disabled={actionId === targetId}
                            className="btn-danger"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          >
                            <X size={14} /> Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7 KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Staff</span>
            <Users size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>{stats?.totalEmployees || users.length}</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Active system accounts</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Present Today</span>
            <CheckCircle2 size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#34d399' }}>{stats?.presentToday || 0}</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Punctual check-ins</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Late Today</span>
            <Clock size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fbbf24' }}>{stats?.lateToday || 0}</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>After 09:15 AM</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Absent Today</span>
            <AlertTriangle size={18} color="#fb7185" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fb7185' }}>{stats?.absentToday || 0}</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Not clocked in</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Pending Leaves</span>
            <CalendarCheck size={18} color="#60a5fa" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#60a5fa' }}>{stats?.pendingLeaves || 0}</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Awaiting decision</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Approved Leaves</span>
            <CheckCircle2 size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#34d399' }}>{stats?.approvedLeaves || 0}</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Granted leaves</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Rejected Leaves</span>
            <XCircle size={18} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f43f5e' }}>{stats?.rejectedLeaves || 0}</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Declined requests</p>
        </div>
      </div>

      {/* SVG Analytics Charts Hub */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem' }}>Executive Analytics Visualizations</h3>
        <AnalyticsCharts stats={stats} />
      </div>

      {/* Quick Access to Employee Management */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>Employee Management Directory</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Manage employee profiles, assign managers, configure roles, and set status</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <UserPlus size={16} /> Add Employee
          </button>
          <button onClick={() => onNavigate('users')} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            Full User Directory <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        userToEdit={selectedUser}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
