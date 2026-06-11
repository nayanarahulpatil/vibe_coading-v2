import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { addExpense } from '../../trip/tripSlice';
import { Receipt } from 'lucide-react';
import styles from './AddExpenseForm.module.css';

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
    <div className={styles.container}>
      <div className={styles.header}>
        <Receipt size={20} className={styles.icon} />
        <h2>Add an Expense</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label}>Who paid?</label>
          <select
            id="payerId"
            name="payerId"
            className={`${styles.input} ${
              formik.touched.payerId && formik.errors.payerId ? styles.inputError : styles.inputSuccess
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
            <div className={styles.errorText}>{formik.errors.payerId}</div>
          ) : null}
        </div>

        <div className={styles.row}>
          <div className={styles.col1}>
            <label className={styles.label}>Amount ($)</label>
            <input
              id="amount"
              name="amount"
              type="text"
              className={`${styles.input} ${
                formik.touched.amount && formik.errors.amount ? styles.inputError : styles.inputSuccess
              }`}
              placeholder="0.00"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.amount}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <div className={styles.errorText}>{formik.errors.amount}</div>
            ) : null}
          </div>

          <div className={styles.col2}>
            <label className={styles.label}>For what?</label>
            <input
              id="description"
              name="description"
              type="text"
              className={`${styles.input} ${
                formik.touched.description && formik.errors.description ? styles.inputError : styles.inputSuccess
              }`}
              placeholder="e.g. Dinner, Gas"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className={styles.errorText}>{formik.errors.description}</div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
        >
          Save Expense
        </button>
      </form>
    </div>
  );
};
