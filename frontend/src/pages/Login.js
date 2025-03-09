import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import '../styles/Login.css';
function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const login = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/auth/login',
        credentials,
      );

      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem('accessToken', response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Terjadi kesalahan saat login.');
    }
  };

  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        name="username"
        placeholder="masukan username"
        value={credentials.username}
        onChange={handleChange}
      />
      <label>Password:</label>
      <input
        type="password"
        name="password"
        placeholder="Masukan Password"
        value={credentials.password}
        onChange={handleChange}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
