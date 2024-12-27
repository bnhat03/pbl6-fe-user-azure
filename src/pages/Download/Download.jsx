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
                </div>
                <div className="btn-container">
                <a 
                        href="/appUser.apk"  // Đường dẫn tuyệt đối tới thư mục public
                        download="user-app.apk"  // Tên tệp khi tải xuống
                        className="btn-download"
                    >
                        <img src={iconUser} alt="" />
                        <span>Người dùng</span>
                    </a>
                    <a 
                        href="/appShipper.apk"  
                        download="shipper-app.apk"  
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