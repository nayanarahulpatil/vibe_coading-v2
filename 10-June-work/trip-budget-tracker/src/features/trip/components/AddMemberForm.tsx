import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { addMemberLocal } from '../tripSlice';
import { tripApi } from '../../../services/tripApi';
import { ApiError } from '../../../services/apiClient';

export const AddMemberForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      upiId: '',
      paypalUsername: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required').min(2, 'Too Short!'),
      upiId: Yup.string().matches(
        /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9.\-_]{2,64}$/,
        { message: 'Invalid UPI ID format (e.g. name@bank)', excludeEmptyString: true }
      ),
      paypalUsername: Yup.string().matches(
        /^([a-zA-Z0-9.\-_]{2,30}|@?[a-zA-Z0-9.\-_]{2,30}|(https?:\/\/)?(www\.)?paypal\.me\/[a-zA-Z0-9.\-_]{2,30})$/i,
        { message: 'Invalid PayPal username or paypal.me link', excludeEmptyString: true }
      ),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      if (!currentTrip) return;
      setServerError(null);

      let cleanPaypal = values.paypalUsername ? values.paypalUsername.trim() : '';
      if (cleanPaypal) {
        if (cleanPaypal.startsWith('@')) cleanPaypal = cleanPaypal.slice(1);
        cleanPaypal = cleanPaypal.replace(/^(https?:\/\/)?(www\.)?paypal\.me\//i, '');
      }

      try {
        const member = await tripApi.addMember(currentTrip.id, {
          name: values.name,
          upiId: values.upiId ? values.upiId.trim() : undefined,
          paypalUsername: cleanPaypal || undefined,
        });
        dispatch(addMemberLocal(member));
        resetForm();
      } catch (err) {
        setServerError(err instanceof ApiError ? err.message : 'Failed to add member');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 mt-4">
      {serverError && (
        <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{serverError}</div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            id="name"
            name="name"
            type="text"
            className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner ${
              formik.touched.name && formik.errors.name
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-primary/50 focus:ring-primary/20'
            }`}
            placeholder="Name (e.g. Alice)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.name}</div>
          ) : null}
        </div>

        <div className="flex-1">
          <input
            id="upiId"
            name="upiId"
            type="text"
            className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 border-slate-200 focus:border-primary/50 focus:ring-primary/20 transition-all shadow-inner"
            placeholder="UPI ID (e.g. name@upi)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.upiId}
          />
        </div>

        <div className="flex-1">
          <input
            id="paypalUsername"
            name="paypalUsername"
            type="text"
            className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 border-slate-200 focus:border-primary/50 focus:ring-primary/20 transition-all shadow-inner"
            placeholder="PayPal Me (e.g. name123)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.paypalUsername}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="bg-slate-900 hover:bg-slate-800 text-slate-100 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm w-full sm:w-fit self-end cursor-pointer disabled:opacity-60"
      >
        {formik.isSubmitting ? 'Adding...' : 'Add Member'}
      </button>
    </form>
  );
};
