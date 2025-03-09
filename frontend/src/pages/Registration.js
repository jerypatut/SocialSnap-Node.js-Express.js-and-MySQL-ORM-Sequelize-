import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import '../styles/Register.css';

function Registration() {
  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'username minimal 3')
      .max(15, 'Username maximal 15')
      .required('Username is required'),
    password: Yup.string()
      .min(4, 'password minimal 4')
      .max(20, 'Password maximal 20')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const onSubmit = async (data, { setSubmitting, resetForm }) => {
    try {
      // Hanya kirim username dan password ke server
      const response = await axios.post('http://localhost:3001/auth', {
        username: data.username,
        password: data.password,
      });
      console.log('Registration successful:', response.data);
      resetForm();
    } catch (error) {
      console.error(
        'Registration error:',
        error.response?.data || error.message,
      );
      alert('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registrationContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form className="formContainer">
            <label htmlFor="username">Username:</label>
            <ErrorMessage
              name="username"
              component="span"
              className="errorMessage"
            />
            <Field
              autoComplete="off"
              id="username"
              name="username"
              placeholder="(contoh.jeri...)"
            />

            <label htmlFor="password">Password:</label>
            <ErrorMessage
              name="password"
              component="span"
              className="errorMessage"
            />
            <Field
              autoComplete="off"
              type="password"
              id="password"
              name="password"
              placeholder="Your Password..."
            />

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <ErrorMessage
              name="confirmPassword"
              component="span"
              className="errorMessage"
            />
            <Field
              autoComplete="off"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Your Password..."
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Registration;
