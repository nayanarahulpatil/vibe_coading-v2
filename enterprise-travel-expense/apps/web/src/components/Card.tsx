import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', ...style }}>
      {children}
    </div>
  );
};
