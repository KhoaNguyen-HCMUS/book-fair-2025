import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Nav from './nav/Nav';
import Home from './home/home.js';
import './App.scss';
import ListBooks from './listBooks/listBooks.js';
import DetailBook from './detailBook/detailBook.js';
import Checkout from './checkout/checkout.js';
import Login from './login/login.js';
import ProtectedRoute from './protectedRoute.js';

const SESSION_TIMEOUT = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isAuth) {
      const loginTime = localStorage.getItem('loginTime');
      setUsername(localStorage.getItem('username') || '');

      const intervalId = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeSinceLogin = currentTime - parseInt(loginTime);

        if (timeSinceLogin > SESSION_TIMEOUT) {
          handleLogout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(intervalId);
    }
  }, [isAuth]);

  useEffect(() => {
    if (isAuth) {
      const resetTimer = () => {
        localStorage.setItem('loginTime', new Date().getTime().toString());
      };

      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('scroll', resetTimer);

      return () => {
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
        window.removeEventListener('click', resetTimer);
        window.removeEventListener('scroll', resetTimer);
      };
    }
  }, [isAuth]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    setIsAuth(false);
  };

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (auth) {
      if (!localStorage.getItem('loginTime')) {
        localStorage.setItem('loginTime', new Date().getTime().toString());
      }
    }
    setIsAuth(auth);
  }, []);

  return (
    <Router>
      <div className='App'>
        {isAuth && <Nav username={username} onLogout={handleLogout} />}
        <header className='App-header'>
          <Routes>
            <Route path='/login' element={<Login setAuth={setIsAuth} />} />
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path='/ListBooks'
              element={
                <ProtectedRoute>
                  <ListBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path='/book/:id'
              element={
                <ProtectedRoute>
                  <DetailBook />
                </ProtectedRoute>
              }
            />
            <Route
              path='/checkout'
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </header>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          transition={toast.Bounce}
        />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
