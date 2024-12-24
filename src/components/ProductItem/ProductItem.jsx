// Display in Category page
import React, { useState } from 'react'
import './ProductItem.scss'
import { Link } from "react-router-dom";
import ProductItemModal from '../ProductItemModal/ProductItemModal';

import store1 from "../../assets/image_gg/introduce_1.png";
import store2 from "../../assets/image_gg/introduce_2.png";
import store3 from "../../assets/image_gg/introduce_3.png";
import store4 from "../../assets/image_gg/introduce_4.png";
import store5 from "../../assets/image_gg/introduce_5.png";

const ProductItem = ({ product, index }) => {
  // Modal
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const handleShowModalProduct = () => {
    setShowModalProduct(true);
  };
  // Sửa lỗi đổi state nhanh quá => Chưa kịp đóng Modal mà đổi nút 
  const handleCloseModalProduct = () => {
    setShowModalProduct(false);
    setTimeout(() => {
      setIsAddToCart(false); // btn 'Mua ngay' trong Modal'
    }, 200);
  };
  const handleAddToCartClick = () => {
    setIsAddToCart(true); // btn 'Thêm vào giỏ hàng' trong Modal'
    handleShowModalProduct();
  };

  return (
    <div className={(index + 1) % 4 !== 0 ? "category-product-item" : "category-product-item product-no-border-right"} key={index}>
      <div className="product-item-img-container">
        <Link to={`/product-detail/${product.productId}`}>
          <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${product.image}`} alt="" className="product-item-image" />
        </Link>
        <div className='product-item-addtocart' onClick={handleAddToCartClick}>
          <i className="fa-solid fa-cart-plus"></i>
        </div>
      </div>
      <h4>{product.productName}</h4>
      <div className="product-item-price-container">
        <span className="product-item-price-discount">
          {/* {Number(product.price - product.discountedPrice).toLocaleString('vi-VN')} đ */}
          {Number(product.discountedPrice).toLocaleString('vi-VN')} đ
        </span>
        <span className="product-item-price-origin">
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
  )
}

export default ProductItem
