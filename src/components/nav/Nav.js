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
            Trang Chủ
          </NavLink>
          <NavLink activeClassName='active' to='/MyListBooks'>
            Sách đã nhập
          </NavLink>
          <NavLink activeClassName='active' to='/addBook'>
            Nhập Sách
          </NavLink>

          {(this.props.userRole === 'Admin' || this.props.userRole === 'BTC') && (
            <NavLink activeClassName='active' to='/bookStore'>
              Kho Sách
            </NavLink>
          )}
          {this.props.userRole === 'Admin' && (
            <NavLink activeClassName='active' to='/createAccount'>
              Tạo Tài Khoản
            </NavLink>
          )}
        </div>

        <div className='nav-right'>
          <span className='username'>{this.props.username}</span>

          <span className='divider'>|</span>
          <span className='role'>{this.props.userRole}</span>
          <button className='logout-btn' onClick={this.props.onLogout}>
            Đăng Xuất
          </button>
        </div>
      </div>
    );
  }
}

export default Nav;
