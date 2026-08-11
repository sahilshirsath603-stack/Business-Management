import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserModal } from '../components/UserModal';
import { UserDetailModal } from '../components/UserDetailModal';
import { Users, UserPlus, Search, Filter, Edit, Trash2, Eye, ShieldAlert, CheckCircle, Ban, Lock, Check, Briefcase } from 'lucide-react';

export const UsersPage = () => {
  const { user: currentUser, showToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionId, setActionId] = useState(null);
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (userToToggle) => {
    const userId = userToToggle.id || userToToggle._id;

    if (userToToggle.email.toLowerCase() === 'sahil@gmail.com') {
      showToast('System Protected: Primary Admin sahil@gmail.com cannot be deactivated.', 'error');
      return;
    }

    setActionId(userId);
    try {
      if (userToToggle.status === 'pending_approval') {
        const res = await api.updateAccessRequest(userId, 'approve');
        showToast(`Account access for ${userToToggle.name} approved successfully!`, 'success');
      } else {
        const newStatus = userToToggle.status === 'active' ? 'deactivated' : 'active';
        const res = await api.updateUser(userId, { status: newStatus });
        showToast(`Employee ${userToToggle.name} is now ${newStatus}.`, 'success');
      }
      await loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    const userId = userToDelete.id || userToDelete._id;

    if (userToDelete.email.toLowerCase() === 'sahil@gmail.com') {
      showToast('System Protected Error: The primary Super Admin account (sahil@gmail.com) is permanently protected and cannot be deleted.', 'error');
      return;
    }

    setActionId(userId);
    try {
      const res = await api.deleteUser(userId);
      showToast(res.message || `Employee ${userToDelete.name} deleted successfully.`, 'success');
      await loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const isSelf = String(u.id || u._id) === String(currentUser?.id || currentUser?._id);
    if (currentUser?.role === 'manager' && (isSelf || u.role !== 'employee')) {
      return false;
    }

    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.designation && u.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
            {isAdmin ? 'Employee Directory & Access Control' : `Department Employee Directory (${currentUser?.department})`}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isAdmin
              ? 'Admin management console to create staff profiles, assign departments, assign managers, configure roles, and manage activation status'
              : `View staff profiles, job designations, contact emails, assigned manager, and leave quotas for your department.`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setSelectedUser(null); setIsFormModalOpen(true); }}
            className="btn-primary"
          >
            <UserPlus size={18} /> Add New Employee
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="glass-input"
            style={{ paddingLeft: '2.8rem' }}
            placeholder="Search by Employee Name, Email, Designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="glass-input"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="all" style={{ background: '#0f172a' }}>All Roles</option>
              <option value="admin" style={{ background: '#0f172a' }}>Admins</option>
              <option value="manager" style={{ background: '#0f172a' }}>Managers</option>
              <option value="employee" style={{ background: '#0f172a' }}>Employees</option>
            </select>
          </div>
        )}
      </div>

      {/* Users List Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading employee roster...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No employee accounts match your filters.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee Profile</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Assigned Manager</th>
                  <th>Status</th>
                  <th>Full Details & Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const targetId = u.id || u._id;
                  const isSahilAdmin = u.email.toLowerCase() === 'sahil@gmail.com';
                  const isBusy = actionId === targetId;

                  return (
                    <tr key={targetId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{u.name}</span>
                          {isSahilAdmin && (
                            <span className="role-pill admin" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Lock size={10} /> Protected Admin
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{u.email}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{u.designation || 'Web Developer'}</span>
                      </td>
                      <td>{u.department}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {u.managerName || 'Unassigned'}
                      </td>
                      <td>
                        <span className={`status-pill ${u.status}`}>{u.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => { setSelectedUser(u); setIsDetailModalOpen(true); }}
                            className="btn-primary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                            title="View Employee Complete Details Profile"
                          >
                            <Eye size={14} /> View Details Profile
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => { setSelectedUser(u); setIsFormModalOpen(true); }}
                                className="btn-secondary"
                                style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem' }}
                                title="Edit Employee Account"
                              >
                                <Edit size={14} /> Edit
                              </button>

                              {!isSahilAdmin && (
                                <>
                                  <button
                                    onClick={() => handleToggleStatus(u)}
                                    disabled={isBusy}
                                    className={u.status === 'active' ? 'btn-danger' : 'btn-success'}
                                    style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem' }}
                                    title={u.status === 'pending_approval' ? 'Approve Access Request' : u.status === 'active' ? 'Deactivate Employee' : 'Reactivate Employee'}
                                  >
                                    {u.status === 'pending_approval' ? <Check size={14} /> : u.status === 'active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                                    {u.status === 'pending_approval' ? ' Approve' : u.status === 'active' ? ' Deactivate' : ' Activate'}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(u)}
                                    disabled={isBusy}
                                    className="btn-danger"
                                    style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem' }}
                                    title="Delete Employee Account"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Employee Modal (Admin Only) */}
      {isAdmin && (
        <UserModal
          isOpen={isFormModalOpen}
          userToEdit={selectedUser}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={loadUsers}
        />
      )}

      {/* View Details Profile Modal (Manager & Admin) */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        user={selectedUser}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};
