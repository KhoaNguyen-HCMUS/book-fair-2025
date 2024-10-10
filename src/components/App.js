import React from 'react';
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

function App() {
  return (
    <Router>
      <div className='App'>
        <Nav />
        <header className='App-header'>
          <Routes>
            <Route path='/' exacts element={<Home />} />
            <Route path='/ListBooks' element={<ListBooks />} />
            <Route path='/book/:id' element={<DetailBook />} />
            <Route path='/checkout' element={<Checkout />} />
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
