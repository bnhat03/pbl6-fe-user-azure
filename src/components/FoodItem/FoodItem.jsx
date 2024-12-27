import React, { useState } from 'react'
import './FoodItem.scss'
import { Link } from "react-router-dom";
import ProductItemModal from '../ProductItemModal/ProductItemModal';

const FoodItem = ({ product }) => { 
  // Modal
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const handleShowModalProduct = () => {
    setShowModalProduct(true); // Hiển thị modal
  };
  const handleCloseModalProduct = () => {
    setShowModalProduct(false); // Đóng modal
    setTimeout(() => {
      setIsAddToCart(false);
    }, 200);
  };
  const handleAddToCartClick = () => {
    setIsAddToCart(true); // "Thêm vào giỏ hàng"
    handleShowModalProduct(); 
  };

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <Link to={`/product-detail/${product.productId}`}>
          <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${product.image}`} alt="" className="food-item-image" />
        </Link>
        <div className='food-item-addtocart' onClick={handleAddToCartClick}>
          <i className="fa-solid fa-cart-plus"></i>
        </div>
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{product.productName}</p>
        </div>
        <div className="food-item-price-container">
          <span className="price-discount">
            {Number(product.discountedPrice).toLocaleString('vi-VN')} đ
          </span>
          <span className="price-origin">
            {Number(product.price).toLocaleString('vi-VN')} đ
          </span>
        </div>
        <button onClick={handleShowModalProduct}>MUA NGAY</button>
        <ProductItemModal
          showModalProduct={showModalProduct}
          handleCloseModalProduct={handleCloseModalProduct}
          product={product}
          stores={product.stores}
          isAddToCart={isAddToCart}
        />
      </div>
    </div>
  )
}

export default FoodItem
