import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordInput } from '../components/PasswordInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { loginUser, clearAuthError } from '../authSlice';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((s) => s.auth);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      dispatch(clearAuthError());
      const result = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard');
      }
    },
  });

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to access your trips">
      <form onSubmit={formik.handleSubmit} className="space-y-4" autoComplete="off">
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-medium">
            {error}
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
            readOnly
            onFocus={(e) => e.target.removeAttribute('readOnly')}
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
            placeholder="Enter your password"
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="flex justify-between text-sm pt-2">
          <Link to="/forgot-password" className="text-primary font-semibold hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-slate-600 font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
