import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BlenLogo } from '../components/BlenLogo';
import { Lock, Mail, User, Briefcase, ShieldCheck, ArrowRight, ArrowLeft, UserPlus, LogIn, CheckCircle, ChevronRight, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const LoginPage = () => {
  const { login, showToast } = useAuth();
  
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState('');
  const [loginError, setLoginError] = useState('');

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Engineering',
    designation: 'Web Developer'
  });

  const handlePortalSelect = (portal) => {
    setSelectedPortal(portal);
    setIsRegisterMode(false);
    setRegisterSuccessMsg('');
    setLoginError('');
    setLoginEmail('');
    setLoginPassword('');
    setShowLoginPassword(false);
    setShowRegPassword(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setLoading(true);
    setLoginError('');
    try {
      await login(loginEmail, loginPassword, selectedPortal);
    } catch (err) {
      setLoginError(err.message || 'Invalid ID and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...regData,
        role: selectedPortal === 'manager' ? 'manager' : 'employee'
      };
      const res = await api.register(payload);
      setRegisterSuccessMsg(res.message);
      showToast(res.message, 'success');
      setRegData({ name: '', email: '', password: '', department: 'Engineering', designation: 'Web Developer' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Spectrum Background Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      {/* ========================================================================= */}
      {/* STEP 1: BLEN DIGITAL ROLE SELECTION GATEWAY WITH LOGO                     */}
      {/* ========================================================================= */}
      {selectedPortal === null && (
        <div style={{ width: '100%', maxWidth: '900px', position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <BlenLogo size={72} />
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '900', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              BLEN DIGITAL
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', marginTop: '0.3rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '700' }}>
              Digital Marketing Agency
            </p>
          </div>

          {/* 3 Sleek Option Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            
            {/* Employee Portal */}
            <div
              onClick={() => handlePortalSelect('employee')}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px',
                border: '1px solid rgba(0, 242, 254, 0.25)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #00f2fe 0%, #00c6ff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#070a12',
                      boxShadow: '0 4px 15px rgba(0, 242, 254, 0.4)'
                    }}
                  >
                    <User size={24} />
                  </div>
                  <span className="role-pill employee">Employee</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                  Employee Portal
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Attendance & Leave Management
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.88rem', color: '#00f2fe' }}>
                <span>Sign In</span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Manager Console */}
            <div
              onClick={() => handlePortalSelect('manager')}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px',
                border: '1px solid rgba(139, 92, 246, 0.25)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                    }}
                  >
                    <Briefcase size={24} />
                  </div>
                  <span className="role-pill manager">Manager</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                  Manager Console
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Team Roster & Approvals
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.88rem', color: '#c084fc' }}>
                <span>Sign In</span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Admin Console */}
            <div
              onClick={() => handlePortalSelect('admin')}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px',
                border: '1px solid rgba(236, 72, 153, 0.25)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                    }}
                  >
                    <ShieldCheck size={24} />
                  </div>
                  <span className="role-pill admin">Admin</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                  Admin Portal
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  System Control & Analytics
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.88rem', color: '#f472b6' }}>
                <span>Sign In</span>
                <ChevronRight size={16} />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: DEDICATED PORTAL LOGIN PAGE WITH LOGO                             */}
      {/* ========================================================================= */}
      {selectedPortal !== null && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '2.25rem',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => setSelectedPortal(null)}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', marginBottom: '1.5rem' }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {/* Title Header with Logo */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'center' }}>
              <BlenLogo size={48} />
            </div>
            <span className={`role-pill ${selectedPortal}`} style={{ fontSize: '0.78rem', marginBottom: '0.5rem', display: 'inline-block' }}>
              {selectedPortal === 'employee' ? 'Employee Portal' : selectedPortal === 'manager' ? 'Manager Console' : 'Admin Portal'}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '0.3rem' }}>
              {selectedPortal === 'employee' && 'Employee Sign In'}
              {selectedPortal === 'manager' && 'Manager Sign In'}
              {selectedPortal === 'admin' && 'Admin Sign In'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '0.2rem', fontWeight: '600' }}>
              Blen Digital • Digital Marketing Agency
            </p>
          </div>

          {/* Tab Switcher for Employee and Manager */}
          {selectedPortal !== 'admin' && (
            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.3rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <button
                onClick={() => { setIsRegisterMode(false); setRegisterSuccessMsg(''); setLoginError(''); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: !isRegisterMode ? 'var(--accent-gradient)' : 'transparent',
                  color: !isRegisterMode ? '#fff' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>

              <button
                onClick={() => { setIsRegisterMode(true); setLoginError(''); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: isRegisterMode ? 'var(--accent-gradient)' : 'transparent',
                  color: isRegisterMode ? '#fff' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                New Account
              </button>
            </div>
          )}

          {/* Error Alert Box inside Form */}
          {loginError && !isRegisterMode && (
            <div
              className="animate-fade-in"
              style={{
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.18)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          {/* Success Alert */}
          {registerSuccessMsg && (
            <div
              style={{
                padding: '0.8rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle size={16} />
              <span>{registerSuccessMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {!isRegisterMode && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    type="email"
                    className="glass-input"
                    style={{ paddingLeft: '2.8rem' }}
                    placeholder="name@blendigital.com"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    className="glass-input"
                    style={{ paddingLeft: '2.8rem', paddingRight: '2.8rem' }}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
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
                    title={showLoginPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.4rem' }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {isRegisterMode && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Full Name"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Email
                </label>
                <input
                  type="email"
                  className="glass-input"
                  placeholder="Email Address"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    className="glass-input"
                    style={{ paddingRight: '2.8rem' }}
                    placeholder="••••••••"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
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
                    title={showRegPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Agency Role / Designation
                </label>
                <select
                  className="glass-input"
                  value={regData.designation}
                  onChange={(e) => setRegData({ ...regData, designation: e.target.value })}
                >
                  <option value="Web Developer" style={{ background: '#0f172a' }}>Web Developer</option>
                  <option value="Video Editor" style={{ background: '#0f172a' }}>Video Editor</option>
                  <option value="Social Media Manager" style={{ background: '#0f172a' }}>Social Media Manager</option>
                  <option value="Script Writer" style={{ background: '#0f172a' }}>Script Writer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Department
                </label>
                <select
                  className="glass-input"
                  value={regData.department}
                  onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                >
                  <option value="Engineering" style={{ background: '#0f172a' }}>Engineering</option>
                  <option value="Marketing" style={{ background: '#0f172a' }}>Marketing</option>
                  <option value="Human Resources" style={{ background: '#0f172a' }}>Human Resources</option>
                  <option value="Finance" style={{ background: '#0f172a' }}>Finance</option>
                  <option value="Management" style={{ background: '#0f172a' }}>Management</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.4rem' }}
              >
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
                <UserPlus size={18} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
