import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { addExpense } from '../../trip/tripSlice';
import { Receipt } from 'lucide-react';

export const AddExpenseForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);

  const formik = useFormik({
    initialValues: {
      payerId: '',
      amount: '',
      description: '',
    },
    validationSchema: Yup.object({
      payerId: Yup.string().required('Select who paid'),
      amount: Yup.number()
        .typeError('Must be a number')
        .positive('Amount must be greater than 0')
        .required('Amount is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(
        addExpense({
          id: crypto.randomUUID(),
          payerId: values.payerId,
          amount: parseFloat(values.amount),
          description: values.description,
          date: new Date().toISOString(),
        })
      );
      resetForm();
    },
  });

  if (!currentTrip || currentTrip.members.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-lg">
        <Receipt size={20} className="text-primary-500" />
        <h2>Add an Expense</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Who paid?</label>
          <select
            id="payerId"
            name="payerId"
            className={`w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              formik.touched.payerId && formik.errors.payerId ? 'border-red-500' : 'border-slate-200'
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.payerId}
          >
            <option value="" disabled>Select a member</option>
            {currentTrip.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {formik.touched.payerId && formik.errors.payerId ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.payerId}</div>
          ) : null}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
            <input
              id="amount"
              name="amount"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                formik.touched.amount && formik.errors.amount ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="0.00"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.amount}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>
            ) : null}
          </div>

          <div className="flex-2 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">For what?</label>
            <input
              id="description"
              name="description"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="e.g. Dinner, Gas"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors mt-2"
        >
          Save Expense
        </button>
      </form>
    </div>
  );
};
