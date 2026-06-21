import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { authApi } from '../../../services/authApi';
import { ApiError } from '../../../services/apiClient';

export const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setServerError(null);
      setIsSubmitting(true);
      try {
        const result = await authApi.forgotPassword(values.email);
        setDevResetUrl(result.devResetUrl ?? null);
        setSubmitted(true);
      } catch (err) {
        setServerError(err instanceof ApiError ? err.message : 'Request failed');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout title="Forgot password" subtitle="We'll send a reset link if the email is registered">
      {submitted ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            If an account exists for that email, a reset link has been sent.
          </p>
          {devResetUrl ? (
            <div className="text-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 space-y-2">
              <p className="font-semibold text-amber-900">Development mode — no email is sent</p>
              <p className="text-amber-800">Use this link to reset your password (valid for 1 hour):</p>
              <a
                href={devResetUrl}
                className="block text-primary font-semibold break-all hover:underline"
              >
                {devResetUrl}
              </a>
            </div>
          ) : (
            <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              No account was found for that email, or the backend is unavailable. Register first, then try again.
            </p>
          )}
          <Link to="/login" className="block text-center text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {serverError && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{serverError}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-3 border rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs mt-1.5">{formik.errors.email}</div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
          <Link to="/login" className="block text-center text-sm text-slate-600 font-semibold hover:underline pt-2">
            Back to Login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
};
