import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.scss'; // Ensure this file exists for styling
import { toast } from 'react-toastify';
function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_LOGIN);
      const result = await response.json();
      if (result.success) {
        setMembers(result.data);
      }
    } catch (error) {
      toast.error('Error connecting to server');
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const member = members.find((m) => m.id_member === username && m.password === password);

    if (member) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTime', new Date().getTime().toString());
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', member.role);
      localStorage.setItem('username', member.name);

      setAuth(true);
      setToggle(true); // Add this line to set toggle state
      navigate('/');
    } else {
      toast.error('Invalid username or password.');
    }
    setLoading(false);
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
