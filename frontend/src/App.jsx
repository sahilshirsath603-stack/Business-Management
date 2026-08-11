import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AttendancePage } from './pages/AttendancePage';
import { LeavePage } from './pages/LeavePage';
import { UsersPage } from './pages/UsersPage';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <div className="glass-panel" style={{ padding: '2rem 3rem', textAlign: 'center' }}>
          <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard onNavigate={setActiveTab} />;
      case 'manager':
        return <ManagerDashboard onNavigate={setActiveTab} />;
      case 'employee':
      default:
        return <EmployeeDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div
        className="main-content"
        style={{
          marginLeft: isDesktop && sidebarOpen ? '260px' : '0',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Navbar
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="page-body animate-fade-in" style={{ padding: isDesktop ? '2rem' : '1rem', flex: 1 }}>
          {activeTab === 'dashboard' && renderDashboardByRole()}

          {activeTab === 'attendance' && (
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <AttendancePage />
            </ProtectedRoute>
          )}

          {activeTab === 'leaves' && (
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <LeavePage />
            </ProtectedRoute>
          )}

          {activeTab === 'users' && (
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <UsersPage />
            </ProtectedRoute>
          )}
        </main>
      </div>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
