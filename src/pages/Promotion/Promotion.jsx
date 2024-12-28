import React, { useState, useEffect, useRef } from 'react';
import './Promotion.scss';
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import line from "../../assets/svg/marker.png";
import promotionIcon from "../../assets/svg/promotion.png";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPromotions } from '../../redux/actions/promotionActions';
import Pagination from 'react-bootstrap/Pagination';

const Promotion = () => {
  const dispatch = useDispatch();
  // state phân trang
  const promotions = useSelector((state) => state.promotion.listPromotions);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); 
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchAllPromotions());
  }, [dispatch]);
  // Lướt 
  const contentRef = useRef(null);
  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // Phân trang
  const indexOfLastPromo = currentPage * itemsPerPage;
  const indexOfFirstPromo = indexOfLastPromo - itemsPerPage;
  const currentPromotions = promotions?.slice(indexOfFirstPromo, indexOfLastPromo);
  const totalPages = Math.ceil(promotions?.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToContent(); // Cuộn lên đầu nội dung khi chuyển trang
  };

  return (
    <section className="page-promotion">
      <Row>
        <div className='header'>
          <div className="header-circle">
            <div className="header-title">KHUYẾN MÃI</div>
            <div className="header-deco">
              <img className='icon-zigzak' src={line} alt="" />
              <img className='icon-promotion' src={promotionIcon} alt="" />
              <img src={line} alt="" />
            </div>
            <div className="header-content">
              NHẬN NHIỀU ƯU ĐÃI ĐẶC BIỆT CÙNG FOS
            </div>
            <div className="header-arrow-down" onClick={scrollToContent}>
              <i className="fa-solid fa-angles-down arrow-animation"></i>
            </div>
          </div>
        </div>
      </Row>
      <div className="container mt-3" ref={contentRef}>
        <div className="promotions-container">
          <div className="promotions-grid">
            {
              currentPromotions && currentPromotions.length > 0 ? (
                currentPromotions.map((promo, index) => (
                  <Link to={`/promotion-detail/${promo.id}`} key={index}>
                    <div className="promo-card">
                      <img src={'data:image/png;base64,' + promo.image} alt='Khuyến mãi' />
                      <div className="promo-content">
                        <h3>{promo.name}</h3>
                        <p>{promo.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='no-promotion'><span>KHÔNG CÓ CHƯƠNG TRÌNH KHUYẾN MÃI</span></div>
              )
            }
          </div>

          {/* Phân trang */}
          <div className="pagination-container">
            <Pagination>
              <Pagination.Prev onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages).keys()].map(number => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Promotion;
