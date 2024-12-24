// Section 2: Codes4Education

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Phone from "../../assets/about/smartphone.png";
import Salad from "../../assets/about/salad.png";
import Delivery from "../../assets/about/delivery-bike.png";
import './Service.scss'

// Mock Data Cards
const mockData = [
  {
    image: Phone,
    title: "Đặt hàng tiện lợi",
    paragraph: `Đặt hàng thật dễ dàng và nhanh chóng chỉ với vài thao tác đơn giản trên website hoặc ứng dụng. Chúng tôi luôn sẵn sàng phục vụ, giúp bạn thưởng thức món ngon mọi lúc, mọi nơi mà không cần phải chờ đợi.`,
  },
  {
    image: Salad,
    title: "Sản phẩm chất lượng",
    paragraph: `Sản phẩm của chúng tôi được chế biến từ nguyên liệu tươi ngon, đảm bảo vệ sinh và an toàn thực phẩm. Mỗi món ăn đều mang đến hương vị tuyệt vời và chất lượng tốt nhất cho bạn.`,
  },
  {
    image: Delivery,
    title: "Giao hàng nhanh chóng",
    paragraph: `Với dịch vụ giao hàng nhanh chóng, chúng tôi đảm bảo món ăn luôn được giao đến tận nơi một cách nhanh nhất, giữ trọn hương vị thơm ngon và độ nóng hổi, mang lại trải nghiệm tuyệt vời cho khách hàng ở mọi lúc, mọi nơi.`,
  },
];

function Service() {
  return (
    <>
      <section className="about_section">
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center">
              <h2>DỊCH VỤ</h2>
              <p>
                Chúng tôi chuyên cung cấp các món ăn nhanh hấp dẫn và tiện lợi, từ hamburger, gà rán, đến pizza và đồ uống giải khát.
                Với cam kết mang đến cho bạn những bữa ăn ngon, chất lượng và phục vụ nhanh chóng, chúng tôi luôn sẵn sàng đáp ứng mọi nhu cầu của bạn.
                Đặt hàng ngay để thưởng thức hương vị tuyệt vời!
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="about_wrapper">
        <Container>
          <Row className="justify-content-md-center">
            {mockData.map((cardData, index) => (
              <Col md={6} lg={4} className="mb-4 mb-md-0" key={index}>
                <div className="about_box text-center">
                  <div className="about_icon">
                    <img
                      src={cardData.image}
                      className="img-fluid"
                      alt="icon"
                    />
                  </div>
                  <h4>{cardData.title}</h4>
                  <p>{cardData.paragraph}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Service;
