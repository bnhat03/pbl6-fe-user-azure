import React from "react";
import './BannerWelcome.scss'
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import homeImage1 from '../../assets/image_gg/home_image_1.png'
import store7 from "../../assets/image_gg/introduce_7.png";
import store8 from "../../assets/image_gg/introduce_8.png";
import store9 from "../../assets/image_gg/introduce_9.png";
import store10 from "../../assets/image_gg/introduce_10.png";
import store11 from "../../assets/image_gg/introduce_11.png";
import store12 from "../../assets/image_gg/introduce_12.png";

function BannerWelcome() {
  // fetch category
  const listCategories = useSelector((state) => {
    return state.category.listCategories;
  })
  return (
    <>
      <section className="shop_section">
        <Row className="align-items-center">
          <Col lg={8} className="text-center text-lg-start mb-5 mb-lg-0 introduce">
            <h4 className="title">FOS XIN CHÀO</h4>
            <p className="description">
              Chào mừng đến với FOS! Với 7 cửa hàng trên toàn quốc, chúng tôi tự hào mang đến trải nghiệm ẩm thực tuyệt vời cho các gia đình Việt.
              Chúng tôi cam kết cung cấp những món ăn ngon, chất lượng vượt trội, dịch vụ tận tâm và giá cả hợp lý.
              Hãy ghé thăm chúng tôi và tận hưởng những khoảnh khắc ẩm thực đáng nhớ!
            </p>
            <NavLink
              to={listCategories.length > 0 ? `/category/${listCategories[0].categoryId}` : "/category"}
              className={({ isActive }) => (isActive ? "active btn order_now btn_red" : "btn order_now btn_red")}
            >
              ĐẶT HÀNG
            </NavLink>
          </Col>
          <Col lg={4}>
            <img src={homeImage1} alt="e-shop" className="img-fluid" />
          </Col>
        </Row>
      </section>
      <section className="brand_section">
        <Row>
          <Carousel>
            <Carousel.Item>
              <Carousel.Caption>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="brand_img">
                    <img src={store7} className="img-fluid" alt="brand-1" />
                  </div>
                  <div className="brand_img">
                    <img src={store8} className="img-fluid" alt="brand-2" />
                  </div>
                  <div className="brand_img">
                    <img src={store9} className="img-fluid" alt="brand-3" />
                  </div>
                  <div className="brand_img">
                    <img src={store10} className="img-fluid" alt="brand-4" />
                  </div>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Carousel.Caption>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="brand_img">
                    <img src={store9} className="img-fluid" alt="brand-1" />
                  </div>
                  <div className="brand_img">
                    <img src={store10} className="img-fluid" alt="brand-2" />
                  </div>
                  <div className="brand_img">
                    <img src={store11} className="img-fluid" alt="brand-3" />
                  </div>
                  <div className="brand_img">
                    <img src={store7} className="img-fluid" alt="brand-4" />
                  </div>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Row>
      </section>
    </>
  );
}

export default BannerWelcome;
