import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../hooks/store';
import { addMember } from '../tripSlice';

export const AddMemberForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      upiId: '',
      paypalUsername: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required').min(2, 'Too Short!'),
      upiId: Yup.string(),
      paypalUsername: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(
        addMember({
          id: crypto.randomUUID(),
          name: values.name,
          upiId: values.upiId ? values.upiId.trim() : undefined,
          paypalUsername: values.paypalUsername ? values.paypalUsername.trim() : undefined,
        })
      );
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 mt-4">
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
            className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner ${
              formik.touched.upiId && formik.errors.upiId 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-slate-200 focus:border-primary/50 focus:ring-primary/20'
            }`}
            placeholder="UPI ID (e.g. name@upi)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.upiId}
          />
          {formik.touched.upiId && formik.errors.upiId ? (
            <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.upiId}</div>
          ) : null}
        </div>

        <div className="flex-1">
          <input
            id="paypalUsername"
            name="paypalUsername"
            type="text"
            className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner ${
              formik.touched.paypalUsername && formik.errors.paypalUsername 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-slate-200 focus:border-primary/50 focus:ring-primary/20'
            }`}
            placeholder="PayPal Me (e.g. name123)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.paypalUsername}
          />
          {formik.touched.paypalUsername && formik.errors.paypalUsername ? (
            <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.paypalUsername}</div>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        className="bg-slate-900 hover:bg-slate-800 text-slate-100 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all w-full sm:w-fit self-end cursor-pointer"
      >
        Add Member
      </button>
    </form>
  );
};
