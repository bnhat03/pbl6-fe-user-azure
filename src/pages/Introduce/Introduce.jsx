import React, { useEffect} from 'react'
import './Introduce.scss'
import { Container, Row, Col, Carousel } from "react-bootstrap";
import Introduce_1 from "../../assets/image_gg/introduce_1.png";
import Introduce_2 from "../../assets/image_gg/introduce_2.png";
import Introduce_3 from "../../assets/image_gg/introduce_3.png";
import Introduce_4 from "../../assets/image_gg/introduce_4.png";
import Introduce_5 from "../../assets/image_gg/introduce_5.png";
import mission from "../../assets/blog/mission.png";
import teamwork from "../../assets/blog/teamwork.png";
import quality from "../../assets/blog/quality.png";
import saving from "../../assets/blog/saving.png";


const Introduce = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <section className="introduce-section-1">
        <Row className="align-items-center section-1-up">
          <div className="container-edit">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0 introduce">
              <h4 className="introduce-section-1-title">LỊCH SỬ HÌNH THÀNH</h4>
              <p className="introduce-section-1-description">
                Chuỗi cửa hàng thức ăn nhanh của chúng tôi khởi nguồn từ một cửa hàng nhỏ với mong muốn mang đến những bữa ăn nhanh gọn và chất lượng cho mọi khách hàng.
                Nhờ sự chăm chỉ và cam kết không ngừng cải thiện, chúng tôi đã dần mở rộng quy mô và trở thành một trong những thương hiệu được yêu thích nhất trong ngành thực phẩm.
              </p>
              <p className='introduce-section-1-description'>
                Trải qua nhiều năm phát triển, chúng tôi tự hào đã xây dựng được một hệ thống cửa hàng rộng khắp, đáp ứng nhu cầu của hàng triệu khách hàng.
                Dù mở rộng về quy mô, chúng tôi vẫn giữ vững sứ mệnh cung cấp các sản phẩm tươi ngon, an toàn và dịch vụ chuyên nghiệp.
              </p>
            </Col>
            <Col lg={6} className='introduce-section-1-image'>
              <img src={Introduce_1} alt="e-introduce" className="img-fluid" />
            </Col>
          </div>
        </Row>
        <Row className="align-items-center section-1-down">
          <Col lg={3} className='section-1-down-subimage'>
            <img src={Introduce_2} alt="e-introduce" className="img-fluid" />
          </Col>
          <Col lg={3} className='section-1-down-subimage'>
            <img src={Introduce_3} alt="e-introduce" className="img-fluid" />
          </Col>
          <Col lg={3} className='section-1-down-subimage'>
            <img src={Introduce_4} alt="e-introduce" className="img-fluid" />
          </Col>
          <Col lg={3} className='section-1-down-subimage'>
            <img src={Introduce_5} alt="e-introduce" className="img-fluid" />
          </Col>
        </Row>
      </section>

      <section className="introduce-section-2">
        <Container>
          <Row>
            <Col lg={12} className="mb-5 mb-lg-0">
              <h4 className="introduce-section-2-title">CỬA HÀNG  CỦA BẠN</h4>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="mb-5 mb-lg-0">
              <p className="introduce-section-2-description">
                Chúng tôi hiện có nhiều cửa hàng trải rộng trên khắp cả nước, tập trung tại các thành phố lớn như Hà Nội, TP. Hồ Chí Minh, Đà Nẵng và nhiều tỉnh thành khác.
                Mỗi chi nhánh đều được đặt ở những vị trí thuận tiện, phục vụ nhanh chóng cho khách hàng
              </p>
              <p className='introduce-section-2-description'>Với sự phát triển mạnh mẽ, hệ thống cửa hàng của chúng tôi không ngừng mở rộng để đáp ứng nhu cầu ngày càng tăng. Dù bạn ở đâu, chúng tôi luôn sẵn sàng mang đến những bữa ăn ngon, tiện lợi và chất lượng.</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="introduce-section-3">
        <Row>
          <Carousel>
            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  <img src={mission} className="img-fluid" alt="User-1" />
                </div>
                <p>
                  "Tất cả những gì mà chúng tôi phải làm là mang đến những hương vị tuyệt vời trong từng món ăn, mang lại niềm vui ẩm thực cho tất cả mọi người."
                </p>
                <h5>SỨ MỆNH</h5>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  <img src={teamwork} className="img-fluid" alt="User-2" />
                </div>
                <p>
                  " Tinh thần tập thể là sức mạnh của sự đoàn kết, nơi mọi người cùng hợp tác, hỗ trợ lẫn nhau để đạt được mục tiêu chung. Khi cùng nhau cố gắng, chúng ta không chỉ thành công mà còn tạo ra môi trường làm việc tích cực và gắn kết. "
                </p>
                <h5>TINH THẦN TẬP THỂ</h5>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  <img src={quality} className="img-fluid" alt="User-2" />
                </div>
                <p>
                  " Cam kết của chúng tôi là mang đến những sản phẩm chất lượng cao nhất, được chế biến từ nguyên liệu tươi ngon và đảm bảo an toàn vệ sinh. Chúng tôi cam kết không ngừng cải tiến để mỗi món ăn đều đạt tiêu chuẩn chất lượng, mang lại sự hài lòng tối đa cho khách hàng. "
                </p>
                <h5>CHẤT LƯỢNG SẢN PHẨM</h5>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  <img src={saving} className="img-fluid" alt="User-2" />
                </div>
                <p>
                  " Chúng tôi luôn hướng tới việc tiết kiệm tối đa mà không ảnh hưởng đến chất lượng sản phẩm. Bằng cách tối ưu hóa quy trình và lựa chọn nguyên liệu hiệu quả, chúng tôi giúp bạn thưởng thức những món ăn ngon với mức giá hợp lý. "
                </p>
                <h5>TIẾT KIỆM</h5>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Row>
      </section>
    </div>
  )
}

export default Introduce
