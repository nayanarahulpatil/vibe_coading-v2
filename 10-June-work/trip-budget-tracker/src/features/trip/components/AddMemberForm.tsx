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
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required').min(2, 'Too Short!'),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(
        addMember({
          id: crypto.randomUUID(),
          name: values.name,
        })
      );
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex gap-2 mt-4">
      <div className="flex-1">
        <input
          id="name"
          name="name"
          type="text"
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Add a person"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
        ) : null}
      </div>
      <button
        type="submit"
        className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors h-fit"
      >
        Add
      </button>
    </form>
  );
};
