import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Travel Requests', path: '/travel-request' },
    { label: 'Expense Claims', path: '/expense-claim' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0'
      }}>
        <div style={{ padding: '0 24px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Enterprise T&E
          </h2>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-primary)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '0 24px' }}>
          <button
            onClick={() => dispatch(logout())}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{
          height: '72px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 32px',
          background: 'var(--bg-secondary)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Demo User</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)' }} />
          </div>
        </header>
        
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};
