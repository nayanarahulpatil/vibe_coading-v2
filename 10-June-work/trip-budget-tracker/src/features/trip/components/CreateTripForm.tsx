import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../hooks/store';
import { createTrip } from '../tripSlice';
import { SUPPORTED_CURRENCIES } from '../../../services/currencyService';

export const CreateTripForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: '',
      baseCurrency: 'USD',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Trip title is required'),
      baseCurrency: Yup.string().required('Base currency is required'),
    }),
    onSubmit: (values) => {
      dispatch(
        createTrip({
          id: crypto.randomUUID(),
          title: values.title,
          members: [],
          baseCurrency: values.baseCurrency,
        })
      );
    },
  });

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/85 transition-all duration-305 hover:shadow-md">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Create a New Trip
      </h2>
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
            {formik.touched.baseCurrency && formik.errors.baseCurrency ? (
              <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.baseCurrency}</div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all w-full sm:w-fit self-end cursor-pointer"
        >
          Start Trip
        </button>
      </form>
    </div>
  );
};
