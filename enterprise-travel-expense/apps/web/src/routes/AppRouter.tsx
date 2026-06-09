import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TravelRequestPage from '../pages/TravelRequestPage';
import ExpenseClaimPage from '../pages/ExpenseClaimPage';

export default function AppRouter() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/travel-request" element={<TravelRequestPage />} />
          <Route path="/expense-claim" element={<ExpenseClaimPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
}
