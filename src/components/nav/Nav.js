import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';
import logo from '../../assets/images/logo.png'; // Adjust the path to your logo image

class Nav extends React.Component {
  render() {
    return (
      <div className='topnav'>
        <div className='nav-left'>
          <img src={logo} alt='Logo' className='logo' />
          <NavLink activeClassName='active' to='/'>
            Home
          </NavLink>
          <NavLink activeClassName='active' to='/ListBooks'>
            List Books
          </NavLink>
        </div>

        <div className='nav-right'>
          <span className='username'>{this.props.username}</span>

          <span className='divider'>|</span>
          <span className='role'>{this.props.userRole}</span>
          <button className='logout-btn' onClick={this.props.onLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }
}

export default Nav;
