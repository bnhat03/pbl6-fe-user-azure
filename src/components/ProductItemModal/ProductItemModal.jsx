import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import './ProductItemModal.scss';
import StoreList from '../StoreList/StoreList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSizes } from "../../redux/actions/sizeActions";
import { toast } from "react-toastify";
import { addToCartProduct, placeOrderUsingBuyNow } from "../../redux/actions/userActions";
import { showLoginModal } from "../../redux/actions/modalActions";


const ProductItemModal = ({ showModalProduct, handleCloseModalProduct, product, stores, isAddToCart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Size
  const listSizes = useSelector((state) => state.size.listSizes);
  const isLogin = useSelector((state) => state.auth.isAuthenticated);
  const [selectedSize, setSelectedSize] = useState(listSizes.length > 0 ? listSizes[0].name : "");
  const [selectedStore, setSelectedStore] = useState(null);
  const [finalPrice, setFinalPrice] = useState((product?.discountedPrice != null) ? product.discountedPrice : 0);

  // Change size
  // const handleSizeChange = (size) => {
  //   setSelectedSize(size); // Cập nhật kích thước được chọn
  //   switch (size) {
  //     case listSizes[0].name:
  //       setFinalPrice((product?.discountedPrice != null) ? product.discountedPrice : 0);
  //       break;
  //     case listSizes[1].name:
  //       setFinalPrice((product?.discountedPrice != null) ? (product.discountedPrice + 10000) : 0);
  //       break;
  //     case listSizes[2].name:
  //       setFinalPrice((product?.discountedPrice != null) ? (product.discountedPrice + 20000) : 0);
  //       break;
  //   }
  // };

  // Optimize change size
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const basePrice = product?.discountedPrice || 0; // Giá cơ bản (size M)
    const sizeIndex = listSizes.findIndex(item => item.name === size); // Tìm chỉ số của kích thước được chọn 
    const finalPrice = sizeIndex >= 0 ? basePrice + sizeIndex * 10000 : 0;
    setFinalPrice(finalPrice); // Cập nhật giá cuối cùng
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store); // Cập nhật cửa hàng đã chọn
  };
  // Quantity + Total Price
  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Fetch all sizes 
  // useEffect(() => {
  //   dispatch(fetchAllSizes());
  // }, [dispatch]);

  // list sizes thay đổi -> Chọn size đầu tiên
  useEffect(() => {
    if (listSizes.length > 0) {
      setSelectedSize(listSizes[0].name);
    }
  }, [listSizes]);

  // Xử lý trường hợp nhấn sang product detail khác, nhấn vô Modal mà FinalPrice vẫn lấy của product trước
  useEffect(() => {
    const basePrice = product?.discountedPrice || 0;
    setFinalPrice(basePrice);
  }, [product]);

  // ADD TO CART / BUY NOW
  const handleAddToCart = async () => {
    if (isLogin === false) { // chưa login
      handleModalClose();
      dispatch(showLoginModal()); // hiện modal login
    } else {
      if (!stores) {
        toast.error('Sản phẩm không có ở cửa hàng nào!');
      }
      else {
        if (!selectedStore) { // Không chọn cửa hàng
          toast.error('Vui lòng chọn cửa hàng');
        }
        else {
          // const store = product.stores.find(store => +store.storeId === +selectedStore.storeId);
          // if (quantity > +store.stockQuantity) {

          // if (quantity > product.stockQuantity) {
          //   toast.error("Số lượng sản phẩm vượt quy định!")
          // }
          // else { // Giả sử thêm vào thành công (Chưa xủ lý các điều kiện -> BE chưa làm)
            dispatch(addToCartProduct(product.productId, quantity, selectedStore.storeId, selectedSize, 'Pending'));
            handleModalClose();
          // }
        }
      }
    }
  }
  const handleBuyNow = () => {
    if (isLogin === false) { // chưa login
      handleModalClose();
      dispatch(showLoginModal()); // hiện modal login
    }
    else {
      if (stores.length === 0) {
        toast.error('Sản phẩm không có ở cửa hàng nào!');
      }
      else {
        if (!selectedStore) { // Không chọn cửa hàng
          toast.error('Vui lòng chọn cửa hàng');
        }
        else { // if: Xử lý tiếp  (Báo lỗi các trường hợp)
          // Note Xử lý: Sản phẩm có:
          // 1. Size khác nhau
          // 2. Cửa hàng khác nhau
          // => Hiển thị số lượng sản phẩm ở cửa hàng tại mỗi size khác nhau
          // => 1. Chọn cửa hàng mới hiển thị size  (Size default: first item)
          //    2. Chọn size -> Hiển thị lại số lượng
          //    3. Chuyển cửa hàng -> Chuyển listSizes + Default size + Số lượng

          // else: Mua được
          // if (quantity > product.stockQuantity) {
          //   toast.error("Số lượng sản phẩm vượt quy định!");
          // }
          // else { // Giả sử thêm vào thành công (Chưa xủ lý các điều kiện -> BE chưa làm)
            dispatch(placeOrderUsingBuyNow(product, finalPrice, quantity, selectedStore, selectedSize));
            navigate('/checkout');
            handleModalClose();
          // }
        }
      }
    }
  }

  // Reset tất cả state khi đóng modal
  const handleModalClose = () => {
    setSelectedStore(null); // Reset cửa hàng về null -> Ko chọn cửa hàng nào
    setSelectedSize(listSizes.length > 0 ? listSizes[0].name : ""); // Reset kích thước về kích thước đầu tiên
    handleCloseModalProduct();
    setTimeout(() => {
      setQuantity(1);
      setFinalPrice(product?.discountedPrice);
    }, 1000);
  };
  return (
    <Modal
      show={showModalProduct}
      onHide={handleModalClose}
      dialogClassName="custom-modal-productitem"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Đặt hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          product ? (
            <div className="modal-product-item">
              <div className="container">
                <div className="product-detail-infor">
                  <div className="infor-left">
                    <div className="img-container">
                      <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${product.image}`} alt="" />
                    </div>
                  </div>
                  <div className="infor-right">
                    <div className="name">{product.productName}</div>
                    <div className="quantity-totalprice-container">
                      <div className="quantity-container">
                        <button className="quantity-btn" onClick={handleDecrease}>
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          readOnly
                          className="quantity-input"
                        />
                        <button className="quantity-btn" onClick={handleIncrease}>
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <div className="totalprice-container">
                        <span>{(finalPrice * quantity).toLocaleString()} đ</span>
                      </div>
                    </div>
                    <div className="store">
                      <div className="store-title">
                        {selectedStore ? <span>&#128073; Cửa hàng đã chọn: {selectedStore.storeName}</span> : <span>&#128073; Chọn cửa hàng</span>}
                      </div>
                      <StoreList stores={stores} onSelectStore={handleStoreSelect} selectedStore={selectedStore} />
                    </div>

                    {/* Note: Chọn cửa hàng rồi mới hiển thị kích cỡ + số lượng còn lại */}
                    {
                      // selectedStore ? (
                      <>
                        <div className="size-container">
                          <span className='title'>&#128073; Chọn kích cỡ</span>
                          <div className="list-size">
                            {listSizes.map((size, index) => ( // Note: Sửa lại listSizes là của sản phẩm ở cửa hàng được chọn => Default size: first item
                              <div
                                key={index}
                                className={`size-item ${selectedSize === size.name ? 'selected' : ''}`}
                                onClick={() => handleSizeChange(size.name)}
                              >
                                <span>{size.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* <div className="stock-quantity">  
                            {selectedStore ? <span>Số lượng sản phẩm còn lại: {product.stockQuantity}</span> : <span></span>}
                          </div> */}
                      </>
                      // )
                      //   : (
                      //     <div></div>
                      //   )

                    }
                    <div className="btn-container">
                      {
                        isAddToCart
                          ? <button onClick={handleAddToCart}>THÊM VÀO GIỎ HÀNG <i className="fa-solid fa-cart-shopping"></i></button>
                          : <button onClick={handleBuyNow}>MUA NGAY <i className="fa-solid fa-file-invoice-dollar"></i></button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Không có thông tin sản phẩm.</p>
          )
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModalProduct}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductItemModal;
