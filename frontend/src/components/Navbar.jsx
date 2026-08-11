import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { BlenLogo } from './BlenLogo';
import { LogOut, Menu } from 'lucide-react';

export const Navbar = ({ activeTab, onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        height: '70px',
        padding: '0 1.5rem',
        borderBottom: '1px solid var(--border-glass)',
        background: 'rgba(7, 10, 18, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          className="btn-secondary"
          style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BlenLogo size={32} />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', textTransform: 'capitalize', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {activeTab}
            </h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: '600', letterSpacing: '0.04em' }}>
              BLEN DIGITAL • Digital Marketing Agency
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Real-time Notification Center */}
        {user && <NotificationCenter />}

        {/* User Info Badge */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-glass)'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                color: '#fff',
                boxShadow: '0 0 10px rgba(0, 242, 254, 0.3)'
              }}
            >
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div style={{ display: 'none', minWidth: '120px', flexDirection: 'column', gap: '2px' }} className="user-details-desktop">
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user.designation || user.department}
              </span>
            </div>
            <span className={`role-pill ${user.role}`}>{user.role}</span>
          </div>
        )}

        <button
          onClick={logout}
          className="btn-secondary"
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          title="Log out"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .user-details-desktop {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
