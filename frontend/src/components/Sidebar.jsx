import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BlenLogo } from './BlenLogo';
import {
  LayoutDashboard,
  Clock,
  CalendarCheck,
  Users,
  ChevronRight,
  Briefcase
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'admin'] },
    { id: 'attendance', label: 'Attendance Logs', icon: Clock, roles: ['employee', 'manager', 'admin'] },
    { id: 'leaves', label: 'Leave Requests', icon: CalendarCheck, roles: ['employee', 'manager', 'admin'] },
    { id: 'users', label: 'Employee Directory', icon: Users, roles: ['admin', 'manager'] }
  ];

  const filteredItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 45
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          background: 'rgba(7, 10, 18, 0.95)',
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 1rem',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div>
          {/* Logo Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
            <BlenLogo size={38} />
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Blen Digital
              </h1>
              <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Digital Marketing Agency
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', padding: '0.5rem 0.75rem' }}>
              Main Navigation
            </p>
            {filteredItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? 'var(--shadow-glow)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current User Quick Info */}
        {user && (
          <div
            className="glass-panel"
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Briefcase size={20} color="var(--accent-cyan)" />
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {user.designation || user.role}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Dept: {user.department}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
