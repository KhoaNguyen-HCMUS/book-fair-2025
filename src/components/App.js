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
import AddReceipt from '../pages/addReceipt/addReceipt.js';
import MyReceipts from '../pages/myReceipts/myReceipts.js';
import ReceiptDetail from './receiptDetail/receiptDetail.js';
import ListReceipts from '../pages/listReceipts/listReceipts.js';

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

  const CashierRoute = ({ children }) => {
    const userRole = localStorage.getItem('userRole');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const hasAlerted = useRef(false);

    useEffect(() => {
      if (
        (!isAuthenticated || (userRole !== 'BTC' && userRole !== 'Admin' && userRole !== 'Cashier')) &&
        !hasAlerted.current
      ) {
        hasAlerted.current = true;
        setTimeout(() => {
          toast.error('You do not have permission to access this page.');
        }, 100);
      }
    }, [isAuthenticated, userRole]);

    if (!isAuthenticated || (userRole !== 'BTC' && userRole !== 'Admin' && userRole !== 'Cashier')) {
      return <Navigate to='/' />;
    }

    return children;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuth(false);
  };

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (auth) {
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
              path='/listReceipts'
              element={
                <OrganizerRoute>
                  <ListReceipts />
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

            <Route
              path='/addReceipt'
              element={
                <CashierRoute>
                  <AddReceipt />
                </CashierRoute>
              }
            />
            <Route
              path='/myReceipts'
              element={
                <CashierRoute>
                  <MyReceipts />
                </CashierRoute>
              }
            />
            <Route
              path='/receiptDetail/:receiptId'
              element={
                <CashierRoute>
                  <ReceiptDetail />
                </CashierRoute>
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
