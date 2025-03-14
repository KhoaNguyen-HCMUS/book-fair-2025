import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Nav from './nav/Nav';
import Home from '../pages/home/home.js';
import './App.scss';
import MyListBooks from '../pages/myListBooks/myListBooks.js';
import Checkout from './checkout/checkout.js';
import Login from '../pages/login/login.js';
import ProtectedRoute from './protectedRoute.js';
import AddBook from '../pages/addBook/addBook.js';
import CreateAccount from '../pages/createAccount/createAccount.js';
import BookDetail from './BookDetail/BookDetail.js';
import BookStore from '../pages/bookStore/bookStore.js';
import MyConsignor from '../pages/myConsignor/myConsignor.js';
import ListConsignors from '../pages/listConsignors/listConsignors.js';
import ConsignorDetail from './consignorDetail/consignorDetail.js';
import ListMembers from '../pages/listMembers/listMembers.js';
import MemberDetail from './memberDetail/memberDetail.js';

const SESSION_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserole] = useState('');
  const [userID, setUserID] = useState('');

  const AdminRoute = ({ children }) => {
    const userRole = localStorage.getItem('userRole');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const hasAlerted = useRef(false);

    useEffect(() => {
      if ((!isAuthenticated || userRole !== 'Admin') && !hasAlerted.current) {
        hasAlerted.current = true;
        setTimeout(() => {
          toast.error('You do not have permission to access this page.');
        }, 100);
      }
    }, [isAuthenticated, userRole]);

    if (!isAuthenticated || userRole !== 'Admin') {
      return <Navigate to='/' />;
    }

    return children;
  };

  const OrganizerRoute = ({ children }) => {
    const userRole = localStorage.getItem('userRole');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const hasAlerted = useRef(false);

    useEffect(() => {
      if ((!isAuthenticated || (userRole !== 'BTC' && userRole !== 'Admin')) && !hasAlerted.current) {
        hasAlerted.current = true;
        setTimeout(() => {
          toast.error('You do not have permission to access this page.');
        }, 100);
      }
    }, [isAuthenticated, userRole]);

    if (!isAuthenticated || (userRole !== 'BTC' && userRole !== 'Admin')) {
      return <Navigate to='/' />;
    }

    return children;
  };

  useEffect(() => {
    if (isAuth) {
      const loginTime = localStorage.getItem('loginTime');

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
      // Set all user data when checking authentication
      setUsername(localStorage.getItem('username') || '');
      setUserole(localStorage.getItem('userRole') || '');
      setUserID(localStorage.getItem('userID') || '');
    }
    setIsAuth(auth);
  }, []);

  return (
    <Router>
      <div className='App'>
        {isAuth && <Nav username={username} userRole={userRole} onLogout={handleLogout} />}
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
              path='/myListBooks'
              element={
                <ProtectedRoute>
                  <MyListBooks userId={userID} typeUser={'member'} />
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
            <Route
              path='/addBook'
              element={
                <ProtectedRoute>
                  <AddBook userRole={userRole} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/createAccount'
              element={
                <AdminRoute>
                  <CreateAccount />
                </AdminRoute>
              }
            />
            <Route
              path='/bookStore'
              element={
                <OrganizerRoute>
                  <BookStore />
                </OrganizerRoute>
              }
            />
            <Route
              path='/myConsignor'
              element={
                <ProtectedRoute>
                  <MyConsignor userId={userID} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/listConsignors'
              element={
                <OrganizerRoute>
                  <ListConsignors />
                </OrganizerRoute>
              }
            />

            <Route
              path='/listMembers'
              element={
                <OrganizerRoute>
                  <ListMembers />
                </OrganizerRoute>
              }
            />
            <Route
              path='/bookDetail/:id'
              element={
                <ProtectedRoute>
                  <BookDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path='/memberDetail/:id'
              element={
                <OrganizerRoute>
                  <MemberDetail />
                </OrganizerRoute>
              }
            />

            <Route
              path='/consignorDetail/:id'
              element={
                <ProtectedRoute>
                  <ConsignorDetail />
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
