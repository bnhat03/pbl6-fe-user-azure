import React from "react";
import "./Footer.scss";
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <div className="footer-contact-container">
            {/* <p className="title">Liên hệ chúng tôi</p> */}
            <h2>Liên hệ</h2>
            <p className="item">Email: FOS_store@gmail.com</p>
            <p className="item">Số điện thoại: 0902857284</p>
            <p className="item">Địa chỉ: 54 NLB - Đà Nẵng</p>
          </div>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Về chúng tôi</h2>
          <ul>
            <li>Trang chủ</li>
            <li>Giới thiệu</li>
            <li>Thực đơn</li>
            <li>Cửa hàng</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Các chính sách</h2>
          <ul>
            <li>Chính sách giao hàng</li>
            <li>Chính sách bảo mật</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>

      </div>
      <hr />
    </div>
  );
};

export default Footer;
