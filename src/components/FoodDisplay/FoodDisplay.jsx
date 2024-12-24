import React, { useState } from "react";
import './FoodDisplay.scss';
import FoodItem from '../FoodItem/FoodItem';
import Pagination from 'react-bootstrap/Pagination';
import FoodItemCombo from "../FoodItem/FoodItemCombo";
import PacmanLoader from 'react-spinners/PacmanLoader';

const FoodDisplay = ({ listProducts, isLoading, itemsPerPage = 4 }) => {
  const [activePage, setActivePage] = useState(1);

  // Tính toán số trang dựa trên danh sách sản phẩm và số sản phẩm mỗi trang
  const totalPages = listProducts ? Math.ceil(+listProducts.length/itemsPerPage) : 0;

  // Lấy danh sách sản phẩm cho trang hiện tại
  const currentProducts = listProducts && listProducts.length > 0 ? (listProducts.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  )) : [];

  // Nhấn vào một trang
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  // Nhấn nút Previous
  const handlePrevious = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  // Nhấn nút Next
  const handleNext = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };

  return (
    <>
      {
        isLoading === false ? (
          <div className='food-display' id='food-display'>
            {currentProducts && currentProducts.length > 0 ? (
              <>
                <div className="food-display-list">
                  {currentProducts.map((product, index) => (
                    product && product.productId ? (
                      <FoodItem key={index} product={product} />
                    ) : (
                      <FoodItemCombo key={index} combo={product} />
                    )
                  ))}
                </div>
                {/* Phần phân trang */}
                <div className="pagination-container">
                  <Pagination className="food-display-pagination">
                    <Pagination.Prev onClick={handlePrevious} disabled={activePage === 1} />
                    {[...Array(totalPages)].map((_, number) => (
                      <Pagination.Item
                        key={number + 1}
                        active={number + 1 === activePage}
                        onClick={() => handlePageChange(number + 1)}
                      >
                        {number + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={handleNext} disabled={activePage === totalPages} />
                  </Pagination>
                </div>
              </>
            ) : (
              <div className="no-product">Không có sản phẩm</div>
            )}
          </div>
        ) : (
          <div className="loading-container">
            <PacmanLoader size={20} color={"#ff0000"} loading={isLoading} />
            <span className="loading-data">Đang tải dữ liệu</span>
          </div>
        )
      }
    </>
  );
};

export default FoodDisplay;
