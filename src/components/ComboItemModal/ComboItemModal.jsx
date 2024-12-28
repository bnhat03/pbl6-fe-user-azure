import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import './ComboItemModal.scss';
import StoreList from '../StoreList/StoreList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSizes } from "../../redux/actions/sizeActions";
import { toast } from "react-toastify";
import { addToCartCombo, placeOrderComboUsingBuyNow } from "../../redux/actions/userActions";
import { fetchAllStores } from "../../redux/actions/storeActions";
import { showLoginModal } from "../../redux/actions/modalActions";
// import { fetchAllDrinks } from "../../redux/actions/productActions";

import { Form } from 'react-bootstrap';


const ComboItemModal = ({ showModalCombo, handleCloseModalCombo, combo, stores, isAddToCart }) => { // 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Size
  const listSizes = useSelector((state) => state.size.listSizes);
  const allDrinks = useSelector((state) => state.product.allDrinks);
  const isLogin = useSelector((state) => state.auth.isAuthenticated);
  const [selectedSize, setSelectedSize] = useState(listSizes.length > 0 ? listSizes[0].name : "");
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedDrinkId, setSelectedDrinkId] = useState("");
  // Lấy đối tượng drink từ productId 
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [finalPrice, setFinalPrice] = useState((combo?.price != null) ? combo.price : 0);

  // Optimize change size
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const basePrice = combo?.price || 0; // Giá cơ bản (size M)
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
  useEffect(() => {
    // console.log('list stores: ', stores);
    // dispatch(fetchAllSizes());
    dispatch(fetchAllStores());
    // dispatch(fetchAllDrinks());
  }, [dispatch]);
  // list sizes thay đổi -> Chọn size đầu tiên
  useEffect(() => {
    if (listSizes.length > 0) {
      setSelectedSize(listSizes[0].name);
    }
  }, [listSizes]);

  useEffect(() => {
    if (combo?.price != null) {
      setFinalPrice(combo.price);
    }
  }, [combo]);

  useEffect(() => {
    if (allDrinks && allDrinks.length > 0) {
      setSelectedDrinkId(allDrinks[0].productId);
    }
  }, [allDrinks]);
  // Cập nhật selectedDrink mỗi khi selectedDrinkId thay đổi
  useEffect(() => {
    const drink = allDrinks.find(drink => +drink.productId === +selectedDrinkId);
    setSelectedDrink(drink);
    // console.log('>>> selectedDrink: ', selectedDrink);
  }, [selectedDrinkId, allDrinks]);

  // ADD TO CART / BUY NOW
  const handleAddToCart = async () => {
    if (isLogin === false) { // chưa login
      handleModalClose();
      dispatch(showLoginModal()); // hiện modal login
    } else {
      // if (!stores) {
      //   toast.error('Sản phẩm không có ở cửa hàng nào!');
      // }
      // else {
      if (!selectedStore) { // Không chọn cửa hàng
        toast.error('Vui lòng chọn cửa hàng');
      }
      else {
        dispatch(addToCartCombo(combo.comboId, quantity, selectedStore.storeId, selectedSize, 'Pending', selectedDrink));
        handleModalClose();

        // if (quantity > product.stockQuantity) {
        //   toast.error("Số lượng sản phẩm vượt quy định!")
        // }
        // else { // Giả sử thêm vào thành công (Chưa xủ lý các điều kiện -> BE chưa làm)
        //   dispatch(addToCart(product.productId, quantity, selectedStore.storeId, selectedSize, 'Pending'));
        //   handleModalClose();
        // }
      }
      // }
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
        else {
          dispatch(placeOrderComboUsingBuyNow(combo, finalPrice, quantity, selectedStore, selectedSize, selectedDrink));
          // console.log('>>> selectedDrink: ', selectedDrink);
          navigate('/checkout');
          handleModalClose();

          // if (quantity > product.stockQuantity) {
          //   toast.error("Số lượng sản phẩm vượt quy định!");
          // }
          // else { // Giả sử thêm vào thành công (Chưa xủ lý các điều kiện -> BE chưa làm)
          //   dispatch(placeOrderUsingBuyNow(product, quantity, selectedStore, selectedSize));
          //   navigate('/checkout');
          //   handleModalClose();
          // }
        }
      }
    }
  }

  // Reset tất cả state khi đóng modal
  const handleModalClose = () => {
    setSelectedStore(null); // Reset cửa hàng về null -> Ko chọn cửa hàng nào
    setSelectedSize(listSizes.length > 0 ? listSizes[0].name : ""); // Reset kích thước về kích thước đầu tiên
    handleCloseModalCombo();
    setTimeout(() => {
      setQuantity(1);
      setFinalPrice(combo.price);
    }, 1000);
  };

  // const drinks = [
  //   { drinkId: 1, drinkName: "Coca Cola", price: 10000 },
  //   { drinkId: 2, drinkName: "Pepsi", price: 10000 },
  //   { drinkId: 3, drinkName: "7Up", price: 10000 }
  // ]
  return (
    <Modal
      show={showModalCombo}
      onHide={handleModalClose}
      dialogClassName="custom-modal-productitem"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Đặt hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          combo ? (
            <div className="modal-product-item">
              <div className="container">
                <div className="product-detail-infor">
                  <div className="infor-left">
                    <div className="img-container">
                      <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${combo.image}`} alt="" />
                    </div>
                  </div>
                  <div className="infor-right">
                    <div className="name">{combo.storeName}</div>
                    <div className="products-container">
                      <span className='title'>&#128073; Danh sách sản phẩm</span>
                      <div className="list-products">
                        {
                          combo?.products && combo.products.length > 0 ? (combo.products.map((item, index) => {
                            return (
                              <div className="product-item" key={index}>
                                <div className="product-item-image">
                                  <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${item.image}`}
                                    alt='Ảnh sản phẩm'
                                  // onClick={() => handleImageClick('data:image/png;base64,' + item.productDetail.productImage)} // Gọi modal preview
                                  />
                                </div>
                                <div className="product-item-infor">
                                  <p className="infor-name">{item.productName}</p>
                                </div>
                              </div>
                            )
                          }))
                            : (
                              <div>Không có sản phẩm nào</div>
                            )
                        }
                      </div>
                    </div>
                    <div className="drinks-container">
                      <span className='title'>&#128073; Chọn nước</span>
                      <div className="list-drinks">
                        <Form.Select
                          className="drink-select"
                          value={selectedDrinkId}
                          onChange={(e) => {
                            setSelectedDrinkId(e.target.value); // Cập nhật selectedDrinkId
                            const drink = allDrinks.find(drink => +drink.productId === +e.target.value);
                            setSelectedDrink(drink); // Cập nhật selectedDrink ngay khi chọn drink mới
                          }}
                        >
                          {
                            allDrinks && allDrinks.length > 0 && allDrinks.map((drink, index) => (
                              <option key={index} value={drink.productId}>
                                {drink.productName}
                              </option>
                            ))
                          }
                        </Form.Select>
                      </div>
                    </div>
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
            <p>Không có thông tin combo.</p>
          )
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModalCombo}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ComboItemModal;
