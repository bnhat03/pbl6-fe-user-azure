// Ẩn cảnh báo validateDOMNesting 
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('validateDOMNesting')) {
    return; // Không log cảnh báo validateDOMNesting
  }
  originalConsoleError(...args);
};
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { showLoginModal, showRegisterModal } from "../../redux/actions/modalActions";
import "./Navbar.scss";
import logoStore from '../../assets/logo4.png'
import logoCart from '../../assets/logo/cart.png'
import logoUser from '../../assets/logo/user.png'
import cate_1 from "../../assets/navbar/cate_1.png";
import ChatButton from "../Chatbox/ChatButton";

const Navbar = () => {
  // state redux
  const dispatch = useDispatch();
  const account = useSelector((state) => state.auth.account);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const listProductsInCart = useSelector((state) => state.user.listProductsInCart); // lấy listProducts in cart -> hiển thị chấm đỏ
  const listCategories = useSelector((state) => {
    return state.category.listCategories;
  })
  //state
  const [avatar, setAvatar] = useState(account?.avatar);
  const [product, setProduct] = useState(null);
  const [st, setST] = useState(null);
  // show modal: login, register
  const handleShowLogin = () => {
    dispatch(showLoginModal());
  };
  const handleShowRegister = () => {
    dispatch(showRegisterModal());
  };

  useEffect(() => {
    setAvatar(account.avatar)
  }, [account]);
  const location = useLocation(); 
  const isMenuActive = listCategories.some( // active cho 'THỰC ĐƠN'
    (category) => location.pathname === `/category/${category.categoryId}` || location.pathname === `/combo`
  );

  //add sticky
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 60) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // responsive
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen);
  };
  const panelRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && !event.target.closest('.navbar-toggle')) {
        setIsLeftPanelOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <button className="navbar-toggle" onClick={toggleLeftPanel}>
        ☰
      </button>
      <div ref={panelRef} className={`left-panel ${isLeftPanelOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleLeftPanel}>×</button>  {/* Nút đóng */}
        <div className="left-panel-content">
          <ul className="left-panel-list">
            <li className="left-panel-item">
              <NavLink to="/" className='left-panel-link'>Trang chủ</NavLink>
            </li>
            <li className="left-panel-item" >
              <NavLink to="/introduce" className='left-panel-link'>Giới thiệu</NavLink>
            </li>
            {/* <li className="left-panel-item">
              <NavLink to="/combo">Combo</NavLink>
            </li> */} 
            {
              listCategories && listCategories.length > 0
              &&
              listCategories.map((category, index) => {
                return (
                  <li key={index} className="left-panel-item">
                    <NavLink
                      to={`/category/${category.categoryId}`}
                      key={index}  
                      className='left-panel-link'
                    >
                      {/* <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${category.image}`} alt="" /> */}
                      {category.categoryName}
                    </NavLink>
                  </li>
                )
              })
            }
            <li className="left-panel-item" >
              <NavLink to="/promotion" className='left-panel-link'>Khuyến mãi</NavLink>
            </li>
            <li className="left-panel-item" >
              <NavLink to="/store" className='left-panel-link'>Cửa hàng</NavLink>
            </li>
            <li className="left-panel-item" >
              <NavLink to="/download" className='left-panel-link'>Tải ngay</NavLink>
            </li>
          </ul>
        </div>
      </div>

      <NavLink
        to="/" className="logo"
        end //Đúng route '/'
      >
        <img src={logoStore} alt="" className="logo-image" />
      </NavLink>
      <ul className="navbar-menu">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
          end
        >
          Trang chủ
        </NavLink>
        <NavLink
          to="/introduce"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Giới thiệu
        </NavLink>
        <NavLink
          to={`combo`}
          className={({ isActive }) => (isActive || isMenuActive ? "active navbar-category" : "navbar-category")}
        >
          Thực đơn
          <ul className="navbar-category-dropdown">
            <li className="navbar-category-item">
              <NavLink
                to={`/combo`}
                className={({ isActive }) => (isActive ? "active-category-item" : "")}
              >
                <img src={cate_1} alt="Ảnh combo" />
                <p>Combo</p>
              </NavLink>
            </li>
            {
              listCategories && listCategories.length > 0
              &&
              listCategories.map((category, index) => {
                return (
                  <li key={index} className="navbar-category-item">
                    <NavLink
                      to={`/category/${category.categoryId}`}
                      key={index}
                      className={({ isActive }) => (isActive ? "active-category-item" : "")}
                    >
                      <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${category.image}`} alt="" />
                      <p>{category.categoryName}</p>
                    </NavLink>
                  </li>

                )
              })
            }
          </ul>
        </NavLink>
        <NavLink
          to="/promotion"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Khuyến mãi
        </NavLink>
        <NavLink
          to="/store"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Cửa hàng
        </NavLink>
        <NavLink
          to="/download"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Tải ngay
        </NavLink>

        {/* <NavLink
          to="/test-map"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          TEST MAP 2
        </NavLink> */}

      </ul >
      <div className="navbar-right">
        {
          isAuthenticated === true
            ? <>
              <NavLink
                to="/cart"
                className={({ isActive }) => (isActive ? 'active navbar-cart-icon' : 'navbar-cart-icon')}
              >
                <img src={logoCart} alt="" />
                {
                  listProductsInCart && listProductsInCart.length > 0 && <div className='dot'></div>
                }

              </NavLink>
              <NavLink
                to="/account"
                className="navbar-profile"
              >
                {
                  avatar ? (
                    <img src={'data:image/png;base64,' + avatar} alt="avatar-user" title="Quản lý tài khoản" />
                  )
                    : (
                      <img src={logoUser} alt="avatar-user" />
                    )
                }
              </NavLink>
              <ChatButton
                product={product}
                setProduct={setProduct}
                st={st}
              />
            </>
            : <>
              <button onClick={handleShowLogin}>Đăng nhập</button>
              <button onClick={handleShowRegister}>Đăng ký</button>
            </>
        }
      </div>
    </div >
  );
};

export default Navbar;
