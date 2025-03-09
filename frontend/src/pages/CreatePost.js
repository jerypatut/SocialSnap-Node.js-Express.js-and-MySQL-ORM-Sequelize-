import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../helpers/AuthContext';
import '../styles/CreatePost.css';
function CreatePost() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [authState, navigate]);

  const initialValues = {
    title: '',
    postText: '',
    image: null,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('input tidak boleh kurang dari 5 a Title!'),
    postText: Yup.string().required('Input tidak boleh kurang dari 5!'),
  });

  const onSubmit = async (data, { setSubmitting }) => {
    try {
      // Karena ada file yang diupload, gunakan FormData
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('postText', data.postText);
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await axios.post(
        'http://localhost:3001/posts',
        formData,
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="formContainer">
            <label htmlFor="title">Title: </label>
            <ErrorMessage
              name="title"
              component="span"
              className="errorMessage"
            />
            <Field
              autoComplete="off"
              id="title"
              name="title"
              placeholder="(Ex. Title...)"
            />

            <label htmlFor="postText">Post: </label>
            <ErrorMessage
              name="postText"
              component="span"
              className="errorMessage"
            />
            <Field
              as="textarea"
              autoComplete="off"
              id="postText"
              name="postText"
              placeholder="(Ex. TULIS POSTMU DISINI...)"
            />

            <label htmlFor="image">Image:</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFieldValue('image', event.currentTarget.files[0])
              }
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreatePost;
