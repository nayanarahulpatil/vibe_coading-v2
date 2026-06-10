import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../hooks/store';
import { createTrip } from '../tripSlice';

export const CreateTripForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Trip title is required'),
    }),
    onSubmit: (values) => {
      dispatch(
        createTrip({
          id: crypto.randomUUID(),
          title: values.title,
          members: [],
        })
      );
    },
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Create a New Trip</h2>
      <form onSubmit={formik.handleSubmit} className="flex gap-4">
        <div className="flex-1">
          <input
            id="title"
            name="title"
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow ${
              formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-slate-200'
            }`}
            placeholder="e.g. Weekend Gateway"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors h-fit"
        >
          Start Trip
        </button>
      </form>
    </div>
  );
};
