import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';
import logo from '../../assets/images/logo.png'; // Adjust the path to your logo image

class Nav extends React.Component {
  getRoleDisplay = (role) => {
    switch (role) {
      case 'CTV':
        return 'Nhập Sách';
      case 'BTC':
        return 'Quản Lý Sách';
      default:
        return role;
    }
  };
  render() {
    const { userRole } = this.props;

    return (
      <div className='topnav'>
        <div className='nav-left'>
          <img src={logo} alt='Logo' className='logo' />
          <div className='home-btn'>
            <NavLink to='/' end>
              Trang Chủ
            </NavLink>
          </div>

          <div className='dropdown'>
            <button className='dropbtn'>
              Nhập Liệu
              <i className='fa fa-caret-down'></i>
            </button>
            <div className='dropdown-content'>
              <NavLink to='/addBook'>Nhập Sách</NavLink>
              <NavLink to='/MyListBooks'>Sách đã nhập</NavLink>
              <NavLink to='/myConsignor'>Người Ký Gửi Đã Nhập</NavLink>
            </div>
          </div>

          {(userRole === 'Admin' || userRole === 'BTC') && (
            <div className='dropdown'>
              <button className='dropbtn'>
                Quản Lý
                <i className='fa fa-caret-down'></i>
              </button>
              <div className='dropdown-content'>
                <NavLink to='/bookStore'>Kho Sách</NavLink>
                <NavLink to='/listConsignors'>DS Người Ký Gửi</NavLink>
                <NavLink to='/listMembers'>DS Thành Viên</NavLink>
              </div>
            </div>
          )}

          {userRole === 'Admin' && (
            <div className='dropdown'>
              <button className='dropbtn'>
                Hệ Thống
                <i className='fa fa-caret-down'></i>
              </button>
              <div className='dropdown-content'>
                <NavLink to='/createAccount'>Tạo Tài Khoản</NavLink>
              </div>
            </div>
          )}

          {(userRole === 'Admin' || userRole === 'Cashier') && (
            <div className='dropdown'>
              <button className='dropbtn'>
                Thu Ngân
                <i className='fa fa-caret-down'></i>
              </button>
              <div className='dropdown-content'>
                <NavLink to='/addReceipt'>Tạo Đơn Hàng</NavLink>

                <NavLink to='/myReceipts'>Đơn Hàng của tôi</NavLink>
              </div>
            </div>
          )}
        </div>

        <div className='nav-right'>
          <span className='username'>{this.props.username}</span>
          <span className='divider'>|</span>
          <span className='role'>{this.getRoleDisplay(userRole)}</span>
          <button className='logout-btn' onClick={this.props.onLogout}>
            Đăng Xuất
          </button>
        </div>
      </div>
    );
  }
}

export default Nav;
