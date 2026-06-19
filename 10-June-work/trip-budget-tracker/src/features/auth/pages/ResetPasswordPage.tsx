import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { authApi } from '../../../services/authApi';
import { ApiError } from '../../../services/apiClient';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
    }),
    onSubmit: async (values) => {
      if (!token) {
        setServerError('Reset link expired or invalid');
        return;
      }
      setServerError(null);
      setIsSubmitting(true);
      try {
        await authApi.resetPassword(token, values.password);
        navigate('/login', { state: { reset: true } });
      } catch (err) {
        setServerError(err instanceof ApiError ? err.message : 'Reset failed');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!token) {
    return (
      <AuthLayout title="Invalid link">
        <p className="text-sm text-red-600 mb-4">Reset link expired or invalid.</p>
        <Link to="/forgot-password" className="text-primary font-semibold hover:underline">
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password" subtitle="Choose a password with at least 8 characters">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {serverError && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{serverError}</div>
        )}
        <div>
          <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-3 border rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs mt-1.5">{formik.errors.password}</div>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full px-4 py-3 border rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-xs mt-1.5">{formik.errors.confirmPassword}</div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthLayout>
  );
};
