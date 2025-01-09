import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.scss'; // Ensure this file exists for styling
import { toast } from 'react-toastify';
function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication check
    if (username === 'admin' && password === 'HS@123456') {
      localStorage.setItem('isAuthenticated', 'true');
      setAuth(true);
      navigate('/');
    } else {
      toast.error('Invalid username or password. If you forgot your password, please contact your administrator.');
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <h2 className='login-title'>Login</h2>
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
                type='text'
                id='password'
                className='form-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Enter your password'
              />
            </div>
            <button type='submit' className='login-button'>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
