import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './Account.scss';
import AccountInfo from '../../components/AccountInfo/AccountInfo';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import Orders from '../../components/Orders/Orders';
import { logoutUser } from '../../redux/actions/authActions';
import { useDispatch } from 'react-redux';

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logoutUser());
    navigate('/');
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  return (
    <div className="account-page">
      {/* Header */}
      <header className="header-account">
        <div className="breadcrumb">
          <span className='pe-3'>Trang chủ</span> &gt; <span className='ps-3'> Quản lý tài khoản</span>
        </div>
        <h1>TÀI KHOẢN CỦA TÔI</h1>
      </header >

      {/* Main content */}
      < div className="main-content" >
        {/* Left side => panel menu */}
        < div className="sidebar" >
          <h6 className='ms-5'>Quản lý tài khoản</h6>
          <ul>
            <li>
              <NavLink
                to='info' 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Thông tin tài khoản
              </NavLink>
            </li>
            <li>
              <NavLink
                to='orders'
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Đơn hàng của bạn
              </NavLink>
            </li>
            <li>
              <NavLink
                to='change-password'
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Đổi mật khẩu
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Đăng xuất
              </button>
            </li>
          </ul>
        </div >

        {/* Right side => content */}
        < div className="content" >
          <Routes>
            <Route path="info" element={<AccountInfo />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="orders" element={<Orders />} />
            <Route path="/" element={<Navigate to="info" replace />} /> {/* Redirect mặc định đến trang "Thông tin tài khoản" */}
          </Routes>
        </div >
      </div >
    </div >
  );
};

export default Account;
