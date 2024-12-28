import React, { useState, useEffect, useRef } from 'react'
import './Store.scss'
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import store7 from "../../assets/image_gg/introduce_7.png";
import store8 from "../../assets/image_gg/introduce_8.png";
import store9 from "../../assets/image_gg/introduce_9.png";
import store10 from "../../assets/image_gg/introduce_10.png";
import store11 from "../../assets/image_gg/introduce_11.png";
import store12 from "../../assets/image_gg/introduce_12.png";

import zigzag from "../../assets/svg/zigzag.png";
import heart from "../../assets/svg/heart.png";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStores } from "../../redux/actions/storeActions";

const Store = () => {
  const contentRef = useRef(null); // Tạo ref để tham chiếu đến nội dung
  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' }); // Cuộn đến nội dung
    }
  };

  // fetch data
  const dispatch = useDispatch();
  const listStores = useSelector((state) => {
    return state.store.listStores;
  })
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchAllStores());
  }, []);
  // Reset contentRef khi component unmounts
  useEffect(() => {
    return () => {
      contentRef.current = null;
    };
  }, []);

  return (
    <section className="page-store">
      <Row>
        {/* Image */}
        <div className='header'>
          <div className="header-circle">
            <div className="header-title">
              CỬA HÀNG
            </div>
            <div className="header-deco">
              <img className='icon-zigzak' src={zigzag} alt="" />
              <img className='icon-heart' src={heart} alt="" />
              <img src={zigzag} alt="" />
            </div>
            <div className="header-content">
              TẬN HƯỞNG NHỮNG KHOẢNH KHẮC TRỌN VẸN CÙNG FOS
            </div>
            <div className="header-arrow-down" onClick={scrollToContent}>
              <i className="fa-solid fa-angles-down arrow-animation"></i>
            </div>
          </div>
        </div>
      </Row>
      <div ref={contentRef} className="list-stores">
        {
          listStores ? <>
            {listStores.map((store, index) => (
              <div key={index} className="store">
                <div
                  className="store-image"
                  style={{
                    background: `url(${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${store.image}) no-repeat center center`,
                    backgroundSize: 'cover',
                  }}
                >
                </div>
                <div className="store-content">
                  <div className="store-name">
                    {store.storeName}
                  </div>
                  <div className="store-address">
                    <span><i className="fa-solid fa-location-dot"></i>{store.location}</span>
                  </div>
                  <div className="store-btn-viewdetail">
                    <Link to={`/store-detail/${store.storeId}`}>
                      <button>Xem chi tiết</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </>
            :
            <div>Không có chi cả</div>
        }
      </div>
    </section>
  )
}

export default Store
