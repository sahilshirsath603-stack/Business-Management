import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck, Key, Briefcase, Mail, ShieldCheck, UserCheck2, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const UserModal = ({ isOpen, onClose, userToEdit, onSuccess }) => {
  const { showToast } = useAuth();
  const [managers, setManagers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'Engineering',
    designation: 'Web Developer',
    reportsTo: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchManagerList = async () => {
      try {
        const res = await api.getUsers();
        // Filter eligible managers/admins
        const list = res.users.filter(u => u.role === 'manager' || u.role === 'admin');
        setManagers(list);
      } catch (e) {}
    };

    if (isOpen) fetchManagerList();
  }, [isOpen]);

  useEffect(() => {
    setShowPassword(false);
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        password: '',
        role: userToEdit.role || 'employee',
        department: userToEdit.department || 'Engineering',
        designation: userToEdit.designation || 'Web Developer',
        reportsTo: userToEdit.reportsTo || '',
        status: userToEdit.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        department: 'Engineering',
        designation: 'Web Developer',
        reportsTo: '',
        status: 'active'
      });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Name and email are required.', 'error');
      return;
    }

    if (!userToEdit && !formData.password) {
      showToast('Password is required for new accounts.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (userToEdit) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        const res = await api.updateUser(userToEdit.id || userToEdit._id, payload);
        showToast(res.message, 'success');
      } else {
        const res = await api.createUser(formData);
        showToast(res.message, 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '580px',
          padding: '2rem',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            {userToEdit ? <UserCheck size={22} /> : <UserPlus size={22} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
              {userToEdit ? 'Edit Staff Details' : 'Add New Staff Member'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Blen Digital • Digital Marketing Agency
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Full Name
              </label>
              <input
                type="text"
                className="glass-input"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Work Email Address
              </label>
              <input
                type="email"
                className="glass-input"
                placeholder="user@blendigital.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Password {userToEdit && '(Leave blank to keep unchanged)'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder={userToEdit ? '••••••••' : 'Enter password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!userToEdit}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                System Role (RBAC)
              </label>
              <select
                className="glass-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="employee" style={{ background: '#0f172a' }}>Employee</option>
                <option value="manager" style={{ background: '#0f172a' }}>Manager</option>
                <option value="admin" style={{ background: '#0f172a' }}>Admin (Full Control)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Agency Designation / Role
              </label>
              <select
                className="glass-input"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              >
                <option value="Web Developer" style={{ background: '#0f172a' }}>Web Developer</option>
                <option value="Video Editor" style={{ background: '#0f172a' }}>Video Editor</option>
                <option value="Social Media Manager" style={{ background: '#0f172a' }}>Social Media Manager</option>
                <option value="Script Writer" style={{ background: '#0f172a' }}>Script Writer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Department Assignment
              </label>
              <select
                className="glass-input"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Engineering" style={{ background: '#0f172a' }}>Engineering</option>
                <option value="Marketing" style={{ background: '#0f172a' }}>Marketing</option>
                <option value="Human Resources" style={{ background: '#0f172a' }}>Human Resources</option>
                <option value="Finance" style={{ background: '#0f172a' }}>Finance</option>
                <option value="Management" style={{ background: '#0f172a' }}>Management</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Assign Manager / Supervisor
              </label>
              <select
                className="glass-input"
                value={formData.reportsTo}
                onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
              >
                <option value="" style={{ background: '#0f172a' }}>None / Unassigned</option>
                {managers.map(m => (
                  <option key={m.id || m._id} value={m.id || m._id} style={{ background: '#0f172a' }}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Account Status
              </label>
              <select
                className="glass-input"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active" style={{ background: '#0f172a' }}>Active</option>
                <option value="deactivated" style={{ background: '#0f172a' }}>Deactivated</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
              {loading ? 'Saving...' : userToEdit ? 'Save Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
