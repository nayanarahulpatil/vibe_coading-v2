import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  style,
  ...props 
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'inherit',
    ...style
  };

  const variants = {
    primary: {
      background: 'var(--accent-gradient)',
      color: '#fff',
      boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
    },
    secondary: {
      background: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--glass-border)',
    },
    danger: {
      background: 'var(--error)',
      color: '#fff',
    }
  };

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant] }} 
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      {...props}
    >
      {children}
    </button>
  );
};
