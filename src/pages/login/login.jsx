import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.scss'; // Ensure this file exists for styling
import { toast } from 'react-toastify';

import { hashFunction } from '../../components/hashFunction/hashFunction.jsx';

const OFFLINE_CREDENTIALS = {
  username: import.meta.env.VITE_OFFLINE_USERNAME,
  password: import.meta.env.VITE_OFFLINE_PASSWORD,
  name: import.meta.env.VITE_OFFLINE_NAME,
  role: import.meta.env.VITE_OFFLINE_ROLE,
};

function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [toggle, setToggle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generateHash = async (baseString) => {
    const hash = await hashFunction(baseString);
    return hash;
  };

  const apiRequest = async (url, method, body = null, headers = {}) => {
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
  };

  const checkLogin = async (username, password) => {
    const url = import.meta.env.VITE_DOMAIN + import.meta.env.VITE_API_LOGIN_CHECK;

    return await apiRequest(url.toString(), 'POST', {
      id_member: username,
      password: password,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hashedPassword = await generateHash(password);

    if (username === OFFLINE_CREDENTIALS.username && hashedPassword === OFFLINE_CREDENTIALS.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTime', new Date().getTime().toString());
      localStorage.setItem('username', OFFLINE_CREDENTIALS.name);
      localStorage.setItem('userRole', OFFLINE_CREDENTIALS.role);
      localStorage.setItem('userID', '0');

      setAuth(true);
      // setToggle(true);
      navigate('/');
      setLoading(false);
      return;
    }

    try {
      const response = await checkLogin(username, hashedPassword);

      if (response.success) {
        const user = response.data[0];

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTime', new Date().getTime().toString());
        localStorage.setItem('username', user.name);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userID', username);

        setAuth(true);
        // setToggle(true);
        navigate('/');
        window.location.reload();
      } else {
        toast.error('Sai tên đăng nhập hoặc mật khẩu. Nếu bạn quên mật khẩu, vui lòng liên hệ quản trị viên.');
      }
    } catch {
      toast.error('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <h2 className='login-title'>Đăng nhập</h2>
          <form onSubmit={handleSubmit} className='login-form'>
            <div className='form-group'>
              <label htmlFor='username' className='form-label'>
                Tên đăng nhập:
              </label>
              <input
                type='text'
                id='username'
                className='form-input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder='Nhập tên đăng nhập'
              />
            </div>
            <div className='password-input-container'>
              <label htmlFor='password' className='form-label'>
                Mật khẩu:
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                className='form-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Nhập mật khẩu'
              />
              <button type='button' className='toggle-password' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '🙉'}
              </button>
            </div>
            <button type='submit' className='login-button' disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
