import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../hooks/store';
import { addMember } from '../tripSlice';
import styles from './AddMemberForm.module.css';

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
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          id="name"
          name="name"
          type="text"
          className={`${styles.input} ${
            formik.touched.name && formik.errors.name ? styles.inputError : styles.inputSuccess
          }`}
          placeholder="Add a person"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className={styles.errorText}>{formik.errors.name}</div>
        ) : null}
      </div>
      <button
        type="submit"
        className={styles.submitButton}
      >
        Add
      </button>
    </form>
  );
};
