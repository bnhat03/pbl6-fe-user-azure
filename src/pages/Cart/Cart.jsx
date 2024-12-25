import React, { useState, useEffect } from "react";
import "./Cart.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductsInCart,
  placeOrderUsingAddToCart,
  removeProductInCart,
  increaseOneQuantity,
  decreaseOneQuantity,

} from "../../redux/actions/userActions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const listProductsInCart = useSelector((state) => {
    return state.user.listProductsInCart;
  })

  const listCombosInCart = useSelector((state) => {
    return state.user.listCombosInCart;
  })

  // Array chứa list cartIds đã check
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchProductsInCart());
  }, [dispatch]);

  // Chọn cửa hàng đầu tiên khi danh sách sản phẩm hoặc combo thay đổi
  // useEffect(() => {
  //   if (Array.isArray(listProductsInCart) && Array.isArray(listCombosInCart)) {
  //     const allItems = [...listProductsInCart, ...listCombosInCart];
  //     if (allItems.length > 0) {
  //       const firstStore = allItems.find((item) => item.product || item.combo);
  //       setSelectedStore(+firstStore?.product?.storeId || +firstStore?.combo?.storeId || 0);
  //     } else {
  //       setSelectedStore(0);
  //     }
  //   }
  // }, [listProductsInCart, listCombosInCart]);

    // const [selectedStore, setSelectedStore] = useState("all");
    const [selectedStore, setSelectedStore] = useState(0);
    useEffect(() => {
      if (Array.isArray(listProductsInCart) && Array.isArray(listCombosInCart)) {
        const allItems = [...listProductsInCart, ...listCombosInCart];
        if (allItems.length > 0 && selectedStore === 0) {
          const firstStore = allItems.find((item) => item.product || item.combo);
          setSelectedStore(+firstStore?.product?.storeId || +firstStore?.combo?.storeId || 0);
        }
      }
    }, [listProductsInCart, listCombosInCart, selectedStore]);

  const handleCheckboxChange = (cartId) => {
    setCheckedItems((prevCheckedItems) =>
      prevCheckedItems.includes(cartId) // array chứa cartID
        ? prevCheckedItems.filter((id) => id !== cartId) // remove
        : [...prevCheckedItems, cartId] // add
    );
  };

  const handleIncreaseQuantity = (item) => {
    if (item) {
      let quantity;
      if (item.product) { // Row là product
        quantity = +item.product.quantity;
      }
      else { // Row là combo
        quantity = +item.combo.quantity;
      }
      dispatch(increaseOneQuantity(item.cartId, quantity + 1));
    }
  };

  const handleDecreaseQuantity = (item) => {
    if ((item?.product?.quantity > 1) || (item?.combo?.quantity > 1)) {
      let quantity;
      if (item.product) {
        quantity = +item.product.quantity;
      }
      else {
        quantity = +item.combo.quantity;
      }
      dispatch(decreaseOneQuantity(item.cartId, quantity - 1));
    }
  };

  const handleRemoveProductInCart = (cartId) => {
    dispatch(removeProductInCart(cartId));
  };

  const getTotalPriceInCart = () => {
    let total = 0;
    for (let i = 0; i < listProductsInCart?.length; i++) {
      const item = listProductsInCart[i];
      if (
        checkedItems.includes(item.cartId) && // checked
        +item.product?.dataStore?.storeId === selectedStore  // Cửa hàng đang chọn ở select
      ) {
        total += item.product.unitPrice * item.product.quantity;
      }
    }
    for (let i = 0; i < listCombosInCart?.length; i++) {
      const item = listCombosInCart[i];
      if (
        checkedItems.includes(item.cartId) &&
        +item.combo?.dataStore?.storeId === selectedStore
      ) {
        total += item.combo.unitPrice * item.combo.quantity;
      }
    }
    return total;
  };


  const handlePlaceOrder = () => {
    if (
      !Array.isArray(listProductsInCart) && listProductsInCart.length === 0 && !Array.isArray(listCombosInCart) && listCombosInCart.length === 0
    ) {
      toast.error('Không có sản phẩm trong giỏ hàng!');
    } else {
      if (checkedItems.length === 0) {
        toast.error('Chọn ít nhất một sản phẩm để thanh toán!');
      } else {
        const selectedProducts = listProductsInCart.filter(
          (item) =>
            checkedItems.includes(item.cartId) && // Row checked
            +item.product?.dataStore?.storeId === selectedStore // Cửa hàng đang chọn
        );
        const selectedCombos = listCombosInCart.filter(
          (item) =>
            checkedItems.includes(item.cartId) &&
            +item.combo?.dataStore?.storeId === selectedStore
        );
        // console.log('selectedProducts: ', selectedProducts);
        // console.log('id selectedStore: ', selectedStore);

        dispatch(placeOrderUsingAddToCart(selectedProducts, selectedCombos, selectedStore));
        navigate('/checkout');
      }
    }
  };


  const [searchTerm, setSearchTerm] = useState("");

  const handleStoreChange = (event) => {
    setSelectedStore(+event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = Array.isArray(listProductsInCart) && Array.isArray(listCombosInCart)
    ? [
      ...listProductsInCart,
      ...listCombosInCart
    ].filter((item) => {
      const storeId = item.product ? item.product.storeId : item.combo.storeId; // storeId product/combo
      const name = item.product ? item.product.productName : item.combo.comboName; // name product/combo
      const isStoreMatch = +storeId === +selectedStore;
      const isSearchMatch = name.toLowerCase().includes(searchTerm.toLowerCase()); // input search
      return isStoreMatch && isSearchMatch;
    }) : [];

  return (
    <div className="page-cart">
      <div className="search-filter-container">
        <div className="search-container">
          <div className="row">
            <div className="col-md-12">
              <div className="input-group">
                <input
                  className="form-control border-end-0 border"
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm sản phẩm"
                />
                <span className="input-group-append">
                  <button className="btn btn-outline-secondary bg-white border ms-n5" type="button">
                    <i className="fa fa-search"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        {
          selectedStore ? (
            <div className="filter-container">
              <select
                className="form-select"
                value={selectedStore}
                onChange={handleStoreChange}
                aria-label="Default select example"
              >
                {/* <option value="all">Tất cả cửa hàng</option> */}
                {/* {
                  // Tìm các store khác nhau trong cart
                  Array.isArray(listProductsInCart) && Array.isArray(listCombosInCart) &&
                  listProductsInCart.concat(listCombosInCart)
                    .map((item) => (item.product ? item.product.dataStore : item.combo.dataStore))
                    .filter((value, index, self) => value && self.findIndex(v => v.storeId === value.storeId) === index)
                    .map((store) => (
                      <option key={store.storeId} value={store.storeId}>
                        {store.storeName}
                      </option>
                    ))
                } */}
                {
                  Array.isArray(listProductsInCart) && Array.isArray(listCombosInCart) &&
                  [
                    // Lọc các store khác nhau trong cart
                    ...new Map(
                      listProductsInCart.concat(listCombosInCart)
                        .map((item) => item.product ? item.product.dataStore : item.combo.dataStore)
                        .filter(Boolean) // Loại bỏ giá trị null/undefined/...
                        .map((store) => [store.storeId, store]) // [key, value] 
                    ).values()
                  ] // => Array chứa các object store khác nhau
                  .map((store) => (
                    <option key={store.storeId} value={store.storeId}>
                      {store.storeName}
                    </option>
                  ))
                }
              </select>
            </div>)
            : (<></>)
        }
      </div>

      <div className="cart-items">
        <div className="cart-items-title">
          <p>Chọn</p>
          <p>Sản phẩm</p>
          <p>Tên</p>
          <p>Kích cỡ</p>
          <p>Cửa hàng</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tổng tiền</p>
          <p>Thao tác</p>
        </div>
        <br />
        <hr />
        {
          filteredProducts && filteredProducts.length > 0 ? (filteredProducts.map((item, index) => { // Xử lý mỗi row có thể là product/combo => Đặt biến chung cho mỗi key trong object
            const isProduct = item.product !== null;
            const data = isProduct ? item.product : item.combo;
            const itemName = isProduct ? data.productName : data.comboName;
            const itemImage = data.image;
            const itemSize = data.size;
            const itemStoreName = data.dataStore ? data.dataStore.storeName : "N/A";
            const itemUnitPrice = data.unitPrice;
            const itemQuantity = data.quantity;
            const itemTotalPrice = itemUnitPrice * itemQuantity;

            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.cartId)} // Checked if item is in checkedItems
                    onChange={() => handleCheckboxChange(item.cartId)} // Toggles item selection
                  />
                  <Link to={isProduct ? `/product-detail/${data.productId}` : `/combo-detail/${data.comboId}`}>
                    <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${itemImage}`} alt="Ảnh sản phẩm" />
                  </Link>
                  <p>{itemName}</p>
                  <p>{itemSize}</p>
                  <p>{itemStoreName}</p>
                  <p>{Number(itemUnitPrice).toLocaleString('vi-VN')} đ</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleDecreaseQuantity(item)}> <i className="fa-solid fa-minus"></i></button>
                    <p>{itemQuantity}</p>
                  <button onClick={() => handleIncreaseQuantity(item)}><i className="fa-solid fa-plus"></i></button>
                  </div>
                  <p>{Number(itemTotalPrice).toLocaleString('vi-VN')} đ</p>
                  <p onClick={() => handleRemoveProductInCart(item.cartId)}>
                    <i className="fa-solid fa-trash action-delete"></i>
                  </p>
                </div>
                <hr />
              </div>
            );
          })
          ) : (
            <div className="no-product">
              <span>Không có sản phẩm trong giỏ hàng</span>
            </div>
          )}
        {
          filteredProducts && filteredProducts.length > 0 && (
            <div>
              <div className="cart-items-title cart-items-item">
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p>Tổng tiền giỏ hàng: </p>
                <p>
                  {Number(getTotalPriceInCart()).toLocaleString('vi-VN')} đ
                </p>
                <button className="btn-redirect-checkout"
                  onClick={handlePlaceOrder}
                >
                  <i className="fa fa-credit-card"></i> Thanh toán
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default Cart;
