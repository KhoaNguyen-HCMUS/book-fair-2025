import React , { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Nav from './nav/Nav';
import Home from './home/home.js';
import './App.scss';
import logo from '../assets/images/logo.png';
import ListBooks from './listBooks/listBooks.js'; // Ensure this path is correct
import DetailBook from './detailBook/detailBook.js';
import Checkout from './checkout/checkout.js';
import Login from './login/login.js';
import ProtectedRoute from './protectedRoute.js';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuth(auth);
  }, []);

  return (
    <Router>
      <div className='App'>
        {isAuth && <Nav />}
        <header className='App-header'>
          <Routes>
            <Route path="/login" element={<Login setAuth={setIsAuth} />} />
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
