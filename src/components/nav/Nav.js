import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';
import logo from '../../assets/images/logo.png'; // Adjust the path to your logo image

class Nav extends React.Component {
  render() {
    return (
      <div className='topnav'>
        <img src={logo} alt='Logo' className='logo' />
        <NavLink activeClassName='active' to='/'>
          Home
        </NavLink>
        <NavLink activeClassName='active' to='/ListBooks'>
          List Books
        </NavLink>
      </div>
    );
  }
}

export default Nav;
