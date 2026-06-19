import React from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
          T
        </div>
        <h1 className="text-xl font-black text-slate-800">Trip Budget Tracker v3</h1>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/85">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mb-6">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>
    </div>
  </div>
);
