import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';
import logo from '../../assets/images/logo.png';

class Nav extends React.Component {
  state = {
    mobileOpen: false,
    activeDropdown: null,
  };

  toggleMobileMenu = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  toggleDropdown = (dropdownName) => {
    this.setState({
      activeDropdown: this.state.activeDropdown === dropdownName ? null : dropdownName,
    });
  };

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
    const { userRole, username, onLogout } = this.props;
    const { mobileOpen, activeDropdown } = this.state;

    return (
      <div className='topnav'>
        <div className='nav-header'>
          <img src={logo} alt='Logo' className='logo' />
          <button className='mobile-toggle' onClick={this.toggleMobileMenu}>
            <i className='fa fa-bars'></i>
          </button>
        </div>

        <div className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
          <div className='nav-left'>
            <div className='home-btn'>
              <NavLink to='/' end>
                Trang Chủ
              </NavLink>
            </div>

            <div className={`dropdown ${activeDropdown === 'nhapLieu' ? 'active' : ''}`}>
              <button className='dropbtn' onClick={() => this.toggleDropdown('nhapLieu')}>
                Nhập Liệu
                <i className={`fa fa-caret-${activeDropdown === 'nhapLieu' ? 'up' : 'down'}`}></i>
              </button>
              <div className={`dropdown-content ${activeDropdown === 'nhapLieu' ? 'open' : ''}`}>
                <NavLink to='/addBook'>Nhập Sách</NavLink>
                <NavLink to='/MyListBooks'>Sách đã nhập</NavLink>
                <NavLink to='/myConsignor'>Người Ký Gửi Đã Nhập</NavLink>
              </div>
            </div>

            {(userRole === 'Admin' || userRole === 'BTC') && (
              <div className={`dropdown ${activeDropdown === 'quanLy' ? 'active' : ''}`}>
                <button className='dropbtn' onClick={() => this.toggleDropdown('quanLy')}>
                  Quản Lý
                  <i className={`fa fa-caret-${activeDropdown === 'quanLy' ? 'up' : 'down'}`}></i>
                </button>
                <div className={`dropdown-content ${activeDropdown === 'quanLy' ? 'open' : ''}`}>
                  <NavLink to='/bookStore'>Kho Sách</NavLink>
                  <NavLink to='/listConsignors'>DS Người Ký Gửi</NavLink>
                  <NavLink to='/listMembers'>DS Thành Viên</NavLink>
                </div>
              </div>
            )}

            {userRole === 'Admin' && (
              <div className={`dropdown ${activeDropdown === 'heThong' ? 'active' : ''}`}>
                <button className='dropbtn' onClick={() => this.toggleDropdown('heThong')}>
                  Hệ Thống
                  <i className={`fa fa-caret-${activeDropdown === 'heThong' ? 'up' : 'down'}`}></i>
                </button>
                <div className={`dropdown-content ${activeDropdown === 'heThong' ? 'open' : ''}`}>
                  <NavLink to='/createAccount'>Tạo Tài Khoản</NavLink>
                </div>
              </div>
            )}

            {(userRole === 'Admin' || userRole === 'Cashier') && (
              <div className={`dropdown ${activeDropdown === 'thuNgan' ? 'active' : ''}`}>
                <button className='dropbtn' onClick={() => this.toggleDropdown('thuNgan')}>
                  Thu Ngân
                  <i className={`fa fa-caret-${activeDropdown === 'thuNgan' ? 'up' : 'down'}`}></i>
                </button>
                <div className={`dropdown-content ${activeDropdown === 'thuNgan' ? 'open' : ''}`}>
                  <NavLink to='/addOrder'>Tạo Đơn Hàng</NavLink>
                  <NavLink to='/historyOrders'>Lịch Sử Đơn Hàng</NavLink>
                </div>
              </div>
            )}
          </div>

          <div className='nav-right'>
            <span className='username'>{username}</span>
            <span className='divider'>|</span>
            <span className='role'>{this.getRoleDisplay(userRole)}</span>
            <button className='logout-btn' onClick={onLogout}>
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Nav;
