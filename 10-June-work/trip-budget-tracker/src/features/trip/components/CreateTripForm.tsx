import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../hooks/store';
import { setCurrentTrip, setTrips } from '../tripSlice';
import { SUPPORTED_CURRENCIES } from '../../../services/currencyService';
import { tripApi } from '../../../services/tripApi';
import { ApiError } from '../../../services/apiClient';

export const CreateTripForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      baseCurrency: 'USD',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Trip title is required'),
      baseCurrency: Yup.string().required('Base currency is required'),
    }),
    onSubmit: async (values) => {
      setServerError(null);
      setIsSubmitting(true);
      try {
        const trip = await tripApi.createTrip(values.title, values.baseCurrency);
        dispatch(setCurrentTrip(trip));
        const trips = await tripApi.listTrips();
        dispatch(setTrips(trips));
      } catch (err) {
        setServerError(err instanceof ApiError ? err.message : 'Failed to create trip');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/85 transition-all duration-305 hover:shadow-md">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Create a New Trip</h2>
      <p className="text-sm text-slate-500 mb-6">Your first trip — data is saved to your account.</p>
      {serverError && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{serverError}</div>
      )}
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <label htmlFor="title" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Trip Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className={`w-full px-5 py-3 border rounded-xl bg-slate-50/50 text-slate-850 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner ${formik.touched.title && formik.errors.title
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-primary/50 focus:ring-primary/20'
                }`}
              placeholder="e.g. Weekend Gateway"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.title}</div>
            ) : null}
          </div>

          <div className="flex-1">
            <label htmlFor="baseCurrency" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Base Currency
            </label>
            <select
              id="baseCurrency"
              name="baseCurrency"
              className={`w-full px-5 py-3 border rounded-xl bg-slate-50/50 text-slate-850 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner cursor-pointer ${formik.touched.baseCurrency && formik.errors.baseCurrency
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-primary/50 focus:ring-primary/20'
                }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.baseCurrency}
            >
              {SUPPORTED_CURRENCIES.map((cur) => (
                <option key={cur} value={cur} className="bg-white text-slate-800 font-normal">
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg disabled:opacity-60 w-full sm:w-fit self-end cursor-pointer"
        >
          {isSubmitting ? 'Creating...' : 'Start Trip'}
        </button>
      </form>
    </div>
  );
};
