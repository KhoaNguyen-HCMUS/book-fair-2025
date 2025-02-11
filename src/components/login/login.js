import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.scss'; // Ensure this file exists for styling
import { toast } from 'react-toastify';

const OFFLINE_CREDENTIALS = {
  username: process.env.REACT_APP_OFFLINE_USERNAME,
  password: process.env.REACT_APP_OFFLINE_PASSWORD,
  name: process.env.REACT_APP_OFFLINE_NAME,
  role: process.env.REACT_APP_OFFLINE_ROLE,
};


function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [toggle, setToggle] = useState(false);

  const apiRequest = async (url, method, body = null, headers = {}) => {
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in apiRequest:', error.message);
      throw error;
    }
  };

  const checkLogin = async (username, password) => {
    const url = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_LOGIN_CHECK;

    try {
      const data = await apiRequest(url.toString(), 'POST', {
        id_member: username,
        password: password,
      });
      return data;
    } catch (error) {
      console.error('Error in checkLogin:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (username === OFFLINE_CREDENTIALS.username && password === OFFLINE_CREDENTIALS.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTime', new Date().getTime().toString());
      localStorage.setItem('username', OFFLINE_CREDENTIALS.name);
      localStorage.setItem('userRole', OFFLINE_CREDENTIALS.role);

      setAuth(true);
      // setToggle(true);
      navigate('/');
      setLoading(false);
      return;
    }

    try {
      const response = await checkLogin(username, password);

      if (response.success) {
        const user = response.data;

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTime', new Date().getTime().toString());
        localStorage.setItem('username', user.name);
        localStorage.setItem('userRole', user.role);

        setAuth(true);
        // setToggle(true);
        navigate('/');
      } else {
        toast.error('Invalid username or password. If you forgot your password, please contact the administrator.');
      }
    } catch (error) {
      toast.error('Error connecting to server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <h2 className='login-title'>Login (Test server)</h2>
          <form onSubmit={handleSubmit} className='login-form'>
            <div className='form-group'>
              <label htmlFor='username' className='form-label'>
                Username:
              </label>
              <input
                type='text'
                id='username'
                className='form-input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder='Enter your username'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password' className='form-label'>
                Password:
              </label>
              <input
                type='password'
                id='password'
                className='form-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Enter your password'
              />
            </div>
            <button type='submit' className='login-button' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
