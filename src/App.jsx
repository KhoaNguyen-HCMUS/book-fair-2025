import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Nav from './components/nav/Nav.jsx';
import Home from './pages/home/home.jsx';
import './App.scss';
import MyListBooks from './pages/myListBooks/myListBooks.jsx';
import Login from './pages/login/login.jsx';
import AddBook from './pages/addBook/addBook.jsx';
import CreateAccount from './pages/createAccount/createAccount.jsx';
import BookDetail from './components/BookDetail/BookDetail.jsx';
import BookStore from './pages/bookStore/bookStore.jsx';
import MyConsignor from './pages/myConsignor/myConsignor.jsx';
import ListConsignors from './pages/listConsignors/listConsignors.jsx';
import ConsignorDetail from './components/consignorDetail/consignorDetail.jsx';
import ListMembers from './pages/listMembers/listMembers.jsx';
import MemberDetail from './components/memberDetail/memberDetail.jsx';
import AddReceipt from './pages/addReceipt/addReceipt.jsx';
import MyReceipts from './pages/myReceipts/myReceipts.jsx';
import ReceiptDetail from './components/receiptDetail/receiptDetail.jsx';
import ListReceipts from './pages/listReceipts/listReceipts.jsx';
import StatisticsPage from './pages/statisticsPage/statisticsPage.jsx';
import ListRegister from './pages/listRegister/listRegister.jsx';
import CheckIn from './pages/checkIn/checkIn.jsx';

import AddReceiptTest from './pages/addReceiptTest/addReceiptTest.jsx';
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserole] = useState('');
  const [userID, setUserID] = useState('');

  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    return isAuthenticated ? children : <Navigate to='/login' />;
  };

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
              path='/check-in'
              element={
                <OrganizerRoute>
                  <CheckIn />
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
              path='/listRegister'
              element={
                <OrganizerRoute>
                  <ListRegister />
                </OrganizerRoute>
              }
            />

            <Route
              path='/statisticsPage'
              element={
                <OrganizerRoute>
                  <StatisticsPage />
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
              path='/addReceiptTest'
              element={
                <CashierRoute>
                  <AddReceiptTest />
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
