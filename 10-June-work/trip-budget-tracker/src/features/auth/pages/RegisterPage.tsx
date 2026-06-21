import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordInput } from '../components/PasswordInput';
import { authApi } from '../../../services/authApi';
import { ApiError } from '../../../services/apiClient';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
    }),
    onSubmit: async (values) => {
      setServerError(null);
      setIsSubmitting(true);
      try {
        await authApi.register(values.email, values.password);
        navigate('/login', { state: { registered: true } });
      } catch (err) {
        setServerError(err instanceof ApiError ? err.message : 'Registration failed');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout title="Create account" subtitle="Minimum 8 characters for your password">
      <form onSubmit={formik.handleSubmit} className="space-y-4" autoComplete="off">
        {serverError && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-medium">
            {serverError}
            {serverError.includes('already exists') && (
              <Link to="/login" className="block mt-1 text-primary underline">
                Go to Login
              </Link>
            )}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="off"
            className="w-full px-4 py-3 border rounded-xl bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1.5">{formik.errors.email}</div>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter password"
            autoComplete="new-password"
            preventAutofill
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
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            autoComplete="new-password"
            preventAutofill
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
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-sm text-center text-slate-600 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
