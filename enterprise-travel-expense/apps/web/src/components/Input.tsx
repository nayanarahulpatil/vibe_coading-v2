import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', width: '100%' }}>
      <label htmlFor={id} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color var(--transition-fast)',
          fontFamily: 'inherit',
          width: '100%',
          ...style
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
        {...props}
      />
    </div>
  );
};
