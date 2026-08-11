import React from 'react';
import { X, User, Mail, Briefcase, Building2, ShieldCheck, UserCheck, Calendar, CalendarCheck } from 'lucide-react';

export const UserDetailModal = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  const balance = user.leaveBalance || { casual: 12, sick: 10, annual: 15 };

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
          maxWidth: '500px',
          padding: '2rem',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
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

        {/* User Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#fff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{user.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</p>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
              <span className={`role-pill ${user.role}`}>{user.role}</span>
              <span className={`status-pill ${user.status}`}>{user.status}</span>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}
          >
            <Building2 size={20} color="var(--accent-primary)" />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase' }}>Department</span>
              <p style={{ fontWeight: '700', fontSize: '0.92rem' }}>{user.department}</p>
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}
          >
            <Briefcase size={20} color="#34d399" />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase' }}>Job Designation</span>
              <p style={{ fontWeight: '700', fontSize: '0.92rem' }}>{user.designation || 'Staff Member'}</p>
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}
          >
            <UserCheck size={20} color="#c084fc" />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase' }}>Assigned Manager</span>
              <p style={{ fontWeight: '700', fontSize: '0.92rem' }}>{user.managerName || 'None'}</p>
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}
          >
            <Calendar size={20} color="#fbbf24" />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase' }}>Account Registered On</span>
              <p style={{ fontWeight: '700', fontSize: '0.92rem' }}>{user.createdAt || 'N/A'}</p>
            </div>
          </div>

          {/* Leave Quota Balances Summary */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              marginTop: '0.3rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <CalendarCheck size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                Remaining Leave Quotas
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Casual</span>
                <div style={{ fontWeight: '800', color: '#fbbf24', fontSize: '1rem' }}>{balance.casual} / 12</div>
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sick</span>
                <div style={{ fontWeight: '800', color: '#60a5fa', fontSize: '1rem' }}>{balance.sick} / 10</div>
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Earned</span>
                <div style={{ fontWeight: '800', color: '#34d399', fontSize: '1rem' }}>{balance.annual || balance.earned || 15} / 15</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', justifyContent: 'center' }}
        >
          Close Detail View
        </button>
      </div>
    </div>
  );
};
