import React from 'react';
import './Download.scss'
import { NavLink } from 'react-router-dom';
import iconUser from '../../assets/download/user.png'
import iconShipper from '../../assets/download/shipper.png'

const Download = () => {
    return (
        <div className="page-download">
            <div className="container">
                <div className="paragraph">
                    <p>Tải ngay ứng dụng của chúng tôi dành cho mobile </p>
                    {/* <NavLink
                        to="/"
                        end
                    >
                        <button>Về trang chủ</button>
                    </NavLink> */}
                </div>
                <div className="btn-container">
                    <a 
                        href={iconUser} 
                        download="user-app.png"
                        className="btn-download"
                    >
                        <img src={iconUser} alt="" />
                        <span>Người dùng</span>
                    </a>
                    <a 
                        href={iconUser}  
                        download="user-app.png"
                        className="btn-download"
                    >
                        <img src={iconShipper} alt="" />
                        <span>Shipper</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Download;