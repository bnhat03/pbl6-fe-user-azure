import React from 'react'
import './Store_Old.scss'
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import DownloadImage from "../../assets/shop/ggmap.jpg";
const Store_Old = () => {
  return (
    <section className="page-store-old">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0 list-stores">
            <div className="list-infor-detail">

              <div className='infor-detail'>
                <h5 className='infor-name'>Olla - 113 Nguyễn Lương Bằng</h5>
                <div className="infor-row infor-address">
                  <div className="infor-icon infor-address-icon">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="infor-content infor-address-content">
                    <p>650 Au cơ, Ward 10, Tan Binh Distric, HCMC</p>
                  </div>
                </div>

                <div className="infor-row infor-phonenumber">
                  <div className="infor-icon infor-phonenumber-icon">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div className="infor-content infor-phonenumber-content">
                    <p> (028) 3861-6848</p>
                  </div>
                </div>

                <div className="infor-row infor-time">
                  <div className="infor-icon infor-time-icon">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div className=" infor-content infor-time-content">
                    <p> 8:30 AM - 9:15 PM (Thứ 2 - Chủ Nhật)</p>
                  </div>
                </div>
              </div>

              <div className='infor-detail'>
                <h5 className='infor-name'>Olla - 113 Nguyễn Lương Bằng</h5>
                <div className="infor-row infor-address">
                  <div className="infor-icon infor-address-icon">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="infor-content infor-address-content">
                    <p>650 Au cơ, Ward 10, Tan Binh Distric, HCMC</p>
                  </div>
                </div>

                <div className="infor-row infor-phonenumber">
                  <div className="infor-icon infor-phonenumber-icon">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div className="infor-content infor-phonenumber-content">
                    <p> (028) 3861-6848</p>
                  </div>
                </div>

                <div className="infor-row infor-time">
                  <div className="infor-icon infor-time-icon">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div className=" infor-content infor-time-content">
                    <p> 8:30 AM - 9:15 PM (Thứ 2 - Chủ Nhật)</p>
                  </div>
                </div>
              </div>

              <div className='infor-detail'>
                <h5 className='infor-name'>Olla - 113 Nguyễn Lương Bằng</h5>
                <div className="infor-row infor-address">
                  <div className="infor-icon infor-address-icon">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="infor-content infor-address-content">
                    <p>650 Au cơ, Ward 10, Tan Binh Distric, HCMC</p>
                  </div>
                </div>

                <div className="infor-row infor-phonenumber">
                  <div className="infor-icon infor-phonenumber-icon">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div className="infor-content infor-phonenumber-content">
                    <p> (028) 3861-6848</p>
                  </div>
                </div>

                <div className="infor-row infor-time">
                  <div className="infor-icon infor-time-icon">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div className=" infor-content infor-time-content">
                    <p> 8:30 AM - 9:15 PM (Thứ 2 - Chủ Nhật)</p>
                  </div>
                </div>
              </div>
            </div>

          </Col>
          <Col lg={6}>
            <img src={DownloadImage} alt="e-shop" className="image-ggmap" />
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Store_Old
