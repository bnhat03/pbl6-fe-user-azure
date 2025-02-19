// Display in Category page
import React, { useState } from 'react'
import './ComboItem.scss'
import { Link } from "react-router-dom";
import ProductItemModal from '../ProductItemModal/ProductItemModal';

import store1 from "../../assets/image_gg/introduce_1.png";
import store2 from "../../assets/image_gg/introduce_2.png";
import store3 from "../../assets/image_gg/introduce_3.png";
import store4 from "../../assets/image_gg/introduce_4.png";
import store5 from "../../assets/image_gg/introduce_5.png";
import ComboItemModal from '../ComboItemModal/ComboItemModal';

const ComboItem = ({ combo, index }) => {
  // Modal
  const [showModalCombo, setShowModalCombo] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const handleShowModalCombo = () => {
    setShowModalCombo(true);
  };
  // Sửa lỗi đổi state nhanh quá => Chưa kịp đóng Modal mà đổi nút 
  const handleCloseModalCombo = () => {
    setShowModalCombo(false);
    setTimeout(() => {
      setIsAddToCart(false); // btn 'Mua ngay' trong Modal'
    }, 200);
  };
  const handleAddToCartClick = () => {
    setIsAddToCart(true); // btn 'Thêm vào giỏ hàng' trong Modal'
    handleShowModalCombo();
  };
  // Tìm store chứa tất cả product trong combo
  const filterStoresWithAllComboProducts = (combo) => {
    if (!combo || !combo.products || combo.products.length === 0) return [];
    // Tạo một mảng gồm các storeId từ sản phẩm đầu tiên trong combo
    let commonStores = combo.products[0].stores.map(store => store.storeId);

    // Duyệt qua từng product trong combo để tìm các storeId chung
    combo.products.forEach((product) => {
      const productStoreIds = product.stores.map(store => store.storeId);
      commonStores = commonStores.filter(storeId => productStoreIds.includes(storeId));
    });

    // Lọc lại thông tin chi tiết của các stores có mặt trong commonStores
    const filteredStores = combo.products[0].stores.filter(store =>
      commonStores.includes(store.storeId)
    );
    // console.log('list stores: ', filteredStores);
    return filteredStores;
  };

  return (
    <div className={(index + 1) % 4 !== 0 ? "category-product-item" : "category-product-item product-no-border-right"} key={index}>
      <div className="product-item-img-container">
        <Link to={`/combo-detail/${combo.comboId}`}>
          <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${combo.image}`} alt="" className="product-item-image" />
        </Link>
        <div className='product-item-addtocart' onClick={handleAddToCartClick}>
          <i className="fa-solid fa-cart-plus"></i>
        </div>
      </div>
      <h4>{combo.comboName}</h4>
      <div className="product-item-price-container">
        <span className="product-item-price-discount">
          {/* {Number(combo.price - combo.discountedPrice).toLocaleString('vi-VN')} đ */}
          {Number(combo.price).toLocaleString('vi-VN')} đ
        </span>
      </div>
      <button onClick={handleShowModalCombo}>MUA NGAY</button>
      <ComboItemModal
        showModalCombo={showModalCombo}
        handleCloseModalCombo={handleCloseModalCombo}
        combo={combo}
        stores={filterStoresWithAllComboProducts(combo)}
        isAddToCart={isAddToCart}
      />
    </div>
  )
}

export default ComboItem
