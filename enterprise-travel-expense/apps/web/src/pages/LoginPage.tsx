import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login());
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-primary)' }}>
      {/* Left split - visual */}
      <div style={{ 
        flex: 1, 
        background: 'var(--bg-tertiary)', 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'var(--accent-gradient)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.15,
          top: '-10%',
          left: '-10%'
        }} />
        <div className="animate-fade-in" style={{ zIndex: 1, maxWidth: '500px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>Welcome to Enterprise T&E</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
            Streamline your travel requests and expense claims with our next-generation platform.
          </p>
        </div>
      </div>

      {/* Right split - form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ width: '400px' }}>
          <h2 style={{ marginBottom: '8px' }}>Sign In</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Access your secure portal</p>
          
          <form onSubmit={handleLogin}>
            <Input label="Corporate Email" id="email" type="email" placeholder="name@enterprise.com" required />
            <div style={{ marginTop: '32px' }}>
              <Button type="submit" fullWidth>Continue with SSO</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
