import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../hooks/store';
import { createTrip } from '../tripSlice';
import styles from './CreateTripForm.module.css';

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
    <div className={styles.container}>
      <h2 className={styles.title}>Create a New Trip</h2>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            id="title"
            name="title"
            type="text"
            className={`${styles.input} ${
              formik.touched.title && formik.errors.title ? styles.inputError : styles.inputSuccess
            }`}
            placeholder="e.g. Weekend Gateway"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className={styles.errorText}>{formik.errors.title}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className={styles.submitButton}
        >
          Start Trip
        </button>
      </form>
    </div>
  );
};
