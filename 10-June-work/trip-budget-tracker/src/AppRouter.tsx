import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/store';
import { bootstrapAuth } from './features/auth/authSlice';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';

const AppBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

function AppRouter() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return (
    <BrowserRouter>
      <AppBootstrap>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppBootstrap>
    </BrowserRouter>
  );
}

export default AppRouter;
