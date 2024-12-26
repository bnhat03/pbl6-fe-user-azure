import types from "../types";
import {
    updateProfileService,
    addProductToCartService,
    addComboToCartService,
    fetchProductsInCartService,
    placeOrderBuyNowService,
    placeOrderComboBuyNowService,
    placeOrderAddToCartService,
    removeProductInCartService,
    increaseOneQuantityService,
    decreaseOneQuantityService,
    fetchAllOrdersService,
    cancelOrderService,
    reviewOrderService,
    fetchOrderInTransitByOrderCodeService,
    fetchShipperDetailByIdService,
    fetchVouchersService,
    fetchFavouriteProducsService,
    saveVoucherService
} from "../../services/userService";
import { getUserAccount } from "./authActions";
import { fetchStoreByIdService } from "../../services/storeService";
import { fetchProductByIdService } from "../../services/productService";
import { toast } from "react-toastify";

// Register New User
const updateProfileSuccess = () => {
    return {
        type: types.UPDATE_PROFILE_SUCCESS,
    };
};

const updateProfileError = (errorMessage) => {
    return {
        type: types.UPDATE_PROFILE_ERROR,
    };
};

const updateProfile = (fullName, avatar, email, address) => {
    return async (dispatch) => {
        try {
            const res = await updateProfileService(fullName, avatar, email, address);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(updateProfileSuccess());
                dispatch(getUserAccount());
                toast.success(res.data.message);
            } else {
                // Handle case where registration was unsuccessful but no error was thrown
                dispatch(updateProfileError());
                toast.error(res.data.message || "Update profile failed.");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response && error.response.data ? error.response.data.message : "An error occurred.";
            dispatch(updateProfileError());
            toast.error(errorMessage);
        }
    };
};

// Add product to cart
const addToCartSuccess = () => {
    return {
        type: types.ADD_TO_CART_SUCCESS,
    };
};
const addToCartError = () => {
    return {
        type: types.ADD_TO_CART_ERROR,
    };
};


const addToCartProduct = (productId, quantity, storeId, size, status) => {
    return async (dispatch) => {
        try {
            const res = await addProductToCartService(productId, quantity, storeId, size, status);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(addToCartSuccess());
                dispatch(fetchProductsInCart());
                toast.success(res.data.message);
            } else {
                dispatch(addToCartError());
                toast.error(res.data.message || "Thêm vào giỏ hàng không thành công!");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response && error.response.data ? error.response.data.message : "An error occurred.";
            dispatch(addToCartError());
            toast.error(errorMessage);
        }
    };
}
const addToCartCombo = (comboId, quantity, storeId, size, status, drink) => {
    return async (dispatch) => {
        try {
            const res = await addComboToCartService(comboId, quantity, storeId, size, status, drink.productId);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(addToCartSuccess());
                dispatch(fetchProductsInCart());
                toast.success(res.data.message);
            } else {
                dispatch(addToCartError());
                toast.error(res.data.message || "Thêm vào giỏ hàng không thành công!");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response && error.response.data ? error.response.data.message : "An error occurred.";
            dispatch(addToCartError());
            toast.error(errorMessage);
        }
    };
}

// fetch list products in cart
const fetchProductsInCartSuccess = (dataProducts, dataCombos) => {
    return {
        type: types.FETCH_PRODUCT_CART_SUCCESS,
        dataProducts: dataProducts,
        dataCombos: dataCombos
    };
};
const fetchProductsInCart = () => {
    return async (dispatch, getState) => {
        try {
            const res = await fetchProductsInCartService();
            let data = res && res.data && res.data.data ? res.data.data : [];
            // Lọc chỉ lấy sản phẩm có type là 'product'
            let dataProducts = data.filter((cartItem) => cartItem.type === 'product');
            dataProducts = await Promise.all(
                dataProducts.map(async (productInCart) => {
                    const resStore = await fetchStoreByIdService(productInCart.product.storeId);
                    // Thêm thông tin cửa hàng -> storeId -> infor store
                    const dataStore = resStore && resStore.data ? resStore.data.data : {};
                    return {
                        ...productInCart,
                        product: {
                            ...productInCart.product,
                            dataStore: dataStore, // Thêm thông tin từ dataStore vào product
                        },
                    };
                })
            );
            // Lọc chỉ lấy sản phẩm có type là 'combo'
            let dataCombos = data.filter((cartItem) => cartItem.type === 'combo');
            dataCombos = await Promise.all(
                dataCombos.map(async (comboItem) => {
                    // Thông tin Store
                    const resStore = await fetchStoreByIdService(comboItem.combo.storeId);
                    const dataStore = resStore && resStore.data ? resStore.data.data : {};
                    // Thông tin drink -> note: Chỉ có 1 drink
                    const resDrink = await fetchProductByIdService(comboItem.combo.drinkId[0]);
                    const dataDrink = resDrink && resDrink.data ? resStore.data.data : {};
                    return {
                        ...comboItem,
                        combo: {
                            ...comboItem.combo,
                            dataStore: dataStore,
                            dataDrink: dataDrink
                        },
                    };
                })
            );
            // Kiểm tra nếu giỏ hàng rỗng
            if (data.length === 0) {
                // console.log("Giỏ hàng trống");
                dispatch(fetchProductsInCartSuccess([]));  // Gửi array rỗng đến redux
            }
            else {
                // console.log('data: ', data);
                dispatch(fetchProductsInCartSuccess(dataProducts, dataCombos));
                // console.log('>>> data cart: ', data);
            }
        } catch (error) {
            console.log(error);
            // BE return status 400 when cart is empty -> rơi vô catch error ni -> note: BE xử lý sai
            dispatch(fetchProductsInCartSuccess([]));
        }
    }
};

// Nhấn MUA NGAY trong Modal -> Chuyển đến Check out
const placeOrderUsingBuyNow = (product, finalPrice, quantity, store, size) => {
    return {
        type: types.BUY_NOW_OPTION,
        productDetail: { product, finalPrice, quantity, store, size },
        dataSelectedStore: store
    };
};

// Nhấn MUA NGAY trong Modal Combo -> Chuyển đến Check out
const placeOrderComboUsingBuyNow = (combo, unitPrice, quantity, store, size, drink) => {
    return {
        type: types.BUY_NOW_COMBO_OPTION,
        comboDetail: { combo, unitPrice, quantity, store, size, drink },
        dataSelectedStore: store
    };
};

// Nhấn THANH TOÁN trong Cart -> Chuyển đến Check out
const placeOrderUsingAddToCartSuccess = (dataProducts, dataCombos, dataSelectedStore) => {
    return {
        type: types.ADD_TO_CART_OPTION,
        dataProducts: dataProducts,
        dataCombos: dataCombos,
        dataSelectedStore: dataSelectedStore
    };
};
const placeOrderUsingAddToCart = (selectedProducts, selectedCombos, idSelectedStore) => {
    return async (dispatch) => {
        try {
            const res = await fetchStoreByIdService(idSelectedStore);
            const isSuccess = res?.data?.success ? res.data.success : false;
            if (isSuccess) {
                let store = res?.data?.data ? res.data.data : {}
                dispatch(placeOrderUsingAddToCartSuccess(selectedProducts, selectedCombos, store));
                // toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Lấy thông tin cửa hàng không thành công!");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response && error.response.data ? error.response.data.message : "An error occurred.";
            toast.error(errorMessage);
        }
    };
};

// Nhấn ĐẶT HÀNG trong Check out -> Chuyển đến Order Complete
const placeOrderBuyNowSuccess = () => {
    return {
        type: types.PLACE_ORDER_BUY_NOW_SUCCESS,
    };
};
const placeOrderBuyNowError = () => {
    return {
        type: types.PLACE_ORDER_BUY_NOW_ERROR,
    };
};

const placeOrderBuyNow = (paymentMethod, productDetailBuyNow, address, longitude, latitude, navigate, voucher) => {
    return async (dispatch) => {
        // console.log('>>> voucher: ', voucher);
        try {
            // dispatch(placeOrderBuyNowSuccess());

            const res = await placeOrderBuyNowService(paymentMethod, productDetailBuyNow, address, longitude, latitude, voucher);
            // console.log('>>> res: ', res);
            if (paymentMethod === 'CASH') {
                const isSuccess = res && res.data ? res.data.success : false;
                if (isSuccess) {
                    dispatch(placeOrderBuyNowSuccess());
                    dispatch(fetchAllOrders());
                    toast.success(res.data.message);
                    navigate('/order-complete');
                } else {
                    dispatch(placeOrderBuyNowError());
                    toast.error(res.data.message || "Đặt hàng không thành công!");
                }
            }
            else if (paymentMethod === 'ZALOPAY') { // ZALOPAY
                // navigate('/order-complete');
                const zalopayUrl = res && res.data && res.data.data ? res.data.data.orderurl : '';
                if (zalopayUrl) {
                    window.location.href = zalopayUrl; // Chuyển hướng sang URL thanh toán của ZaloPay
                } else {
                    toast.error("Không thể thanh toán đơn hàng với ZaloPay!");
                }
            }
            else if (paymentMethod === 'MOMO') { // MOMO
                // navigate('/order-complete');
                const momoUrl = res?.data?.data?.payUrl ? res.data.data.payUrl : '';
                if (momoUrl) {
                    window.location.href = momoUrl; // Chuyển hướng sang URL thanh toán của momo
                } else {
                    toast.error("Không thể thanh toán đơn hàng với Momo!");
                }
            }
        } catch (error) {
            console.log(error);
            dispatch(placeOrderBuyNowError());
            toast.error('Có lỗi ở Server');
        }
    };
}
const placeOrderComboBuyNow = (paymentMethod, comboDetailBuyNow, address, longitude, latitude, navigate, voucher) => {
    return async (dispatch) => {
        // console.log('>>> voucher: ', voucher);
        try {
            // dispatch(placeOrderBuyNowSuccess());

            const res = await placeOrderComboBuyNowService(paymentMethod, comboDetailBuyNow, address, longitude, latitude, voucher);
            if (paymentMethod === 'CASH') {
                const isSuccess = res && res.data ? res.data.success : false;
                if (isSuccess) {
                    dispatch(placeOrderBuyNowSuccess());
                    dispatch(fetchAllOrders());
                    toast.success(res.data.message);
                    navigate('/order-complete');
                } else {
                    dispatch(placeOrderBuyNowError());
                    toast.error(res.data.message || "Đặt hàng không thành công!");
                }
            }
            else if (paymentMethod === 'ZALOPAY') { // ZALOPAY
                const zalopayUrl = res && res.data && res.data.data ? res.data.data.orderurl : '';
                if (zalopayUrl) {
                    window.location.href = zalopayUrl; // Chuyển hướng sang URL thanh toán của ZaloPay
                } else {
                    toast.error("Không thể thanh toán đơn hàng với ZaloPay!");
                }
            }
            else if (paymentMethod === 'MOMO') { // MOMO
                const momoUrl = res?.data?.data?.payUrl ? res.data.data.payUrl : '';
                if (momoUrl) {
                    window.location.href = momoUrl; // Chuyển hướng sang URL thanh toán của MOMO
                } else {
                    toast.error("Không thể thanh toán đơn hàng với Momo!");
                }
            }
        } catch (error) {
            console.log(error);
            dispatch(placeOrderBuyNowError());
            toast.error('Có lỗi ở Server');
        }
    };
}
// Check out = Add to cart
const placeOrderAddToCartSuccess = () => {
    return {
        type: types.PLACE_ORDER_ADD_TO_CART_SUCCESS,
    };
};
const placeOrderAddToCartError = () => {
    return {
        type: types.PLACE_ORDER_ADD_TO_CART_ERROR,
    };
};

const placeOrderAddToCart = (paymentMethod, cartIds, address, longitude, latitude, navigate, voucher) => {
    return async (dispatch) => {
        try {
            const res = await placeOrderAddToCartService(paymentMethod, cartIds, address, longitude, latitude, voucher);
            // console.log('>>> res: ', res);
            if (paymentMethod === 'CASH') {
                const isSuccess = res && res.data ? res.data.success : false;
                if (isSuccess) {
                    dispatch(placeOrderAddToCartSuccess());
                    dispatch(fetchAllOrders());
                    toast.success(res.data.message);
                    navigate('/order-complete');
                } else {
                    dispatch(placeOrderAddToCartError());
                    toast.error(res.data.message || "Đặt hàng không thành công!");
                }
            }
            else if (paymentMethod === 'ZALOPAY') { // ZALOPAY
                const zalopayUrl = res && res.data ? res.data.data.orderurl : '';
                if (zalopayUrl) {
                    window.location.href = zalopayUrl; // Chuyển hướng sang URL thanh toán của ZaloPay
                } else {
                    toast.error("Không thể thanh toán đơn hàng với ZaloPay!");
                }
            }
            else if (paymentMethod === 'MOMO') { // MOMO
                const momoUrl = res?.data?.data?.payUrl ? res.data.data.payUrl : '';
                if (momoUrl) {
                    window.location.href = momoUrl; // Chuyển hướng sang URL thanh toán của MOMO
                } else {
                    toast.error("Không thể thanh toán đơn hàng với Momo!");
                }
            }
        } catch (error) {
            console.log(error);
            dispatch(placeOrderAddToCartError());
            toast.error('Có lỗi ở Server');
        }
    };
}

//
const resetAllUser = () => {
    return {
        type: types.RESET_ALL_USER,
    };
}
// Xóa sp khỏi giỏ hàng
const removeProductInCartSuccess = () => {
    return {
        type: types.REMOVE_PRODUCT_IN_CART_SUCCESS,
    };
};
const removeProductInCart = (cartId) => {
    return async (dispatch, getState) => {
        try {
            const res = await removeProductInCartService(cartId);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(removeProductInCartSuccess());
                dispatch(fetchProductsInCart());
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Xóa sản phẩm khỏi giỏ hàng không thành công!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi ở Server!");
        }
    }
};

// Nhấn + => Tăng 1
const increaseOneQuantitySuccess = () => {
    return {
        type: types.INCREASE_ONE_QUANTITY_SUCCESS,
    };
};
const increaseOneQuantity = (cartId, quantity) => {
    return async (dispatch, getState) => {
        try {
            const res = await increaseOneQuantityService(cartId, quantity);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(increaseOneQuantitySuccess());
                dispatch(fetchProductsInCart());
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi ở Server!");
        }
    }
};
// Nhấn - => Giảm 1
const decreaseOneQuantitySuccess = () => {
    return {
        type: types.DECREASE_ONE_QUANTITY_SUCCESS,
    };
};
const decreaseOneQuantity = (cartId, quantity) => {
    return async (dispatch, getState) => {
        try {
            const res = await decreaseOneQuantityService(cartId, quantity);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(decreaseOneQuantitySuccess());
                dispatch(fetchProductsInCart());
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi ở Server!");
        }
    }
};

// Lấy tất cả orders
const fetchAllOrdersSuccess = (data) => {
    return {
        type: types.FETCH_ALL_ORDERS_SUCCESS,
        dataOrders: data
    };
};
const fetchAllOrders = () => {
    return async (dispatch, getState) => {
        try {
            const res = await fetchAllOrdersService();
            const dataOrder = res && res.data && res.data.data ? res.data.data : [];
            // dataOrder = await Promise.all(
            //     dataOrder.orderDetails.map(async (productInOrder) => {
            //         const resStore = await fetchStoreByIdService(productInOrder.productDetail.storeId);
            //         // Thêm thông tin cửa hàng -> storeId -> infor store
            //         const dataStore = resStore && resStore.data ? resStore.data.data : {};
            //         return {
            //             ...productInOrder,
            //             product: {
            //                 ...productInOrder.product,
            //                 dataStore: dataStore, // Thêm thông tin từ dataStore vào product
            //             },
            //         };
            //     })
            // );
            dispatch(fetchAllOrdersSuccess(dataOrder));
        } catch (error) {
            console.log(error);
            // toast.error('Có lỗi ở Server!');  // BE return status=400 -> Lỗi do BE nên chạy vô catch error ni
        }
    }
};
// Hủy đơn hàng
const cancelOrderSuccess = () => {
    return {
        type: types.CANCEL_ORDER_SUCCESS,
    };
};
const cancelOrder = (orderCode) => {
    return async (dispatch) => {
        try {
            const res = await cancelOrderService(orderCode);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(cancelOrderSuccess());
                dispatch(fetchAllOrders()); // Recall API lấy lại all orders
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Hủy đơn hàng không thành công!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Hủy đơn hàng không thành công!");
        }
    };
};

// đánh giá đơn hàng
const reviewOrderSuccess = () => {
    return {
        type: types.REVIEW_ORDER_SUCCESS,
    };
};
const reviewOrder = (listProductIds, listComboIds, rate, listImageFiles, comment) => {
    return async (dispatch) => {
        try {
            const res = await reviewOrderService(listProductIds, listComboIds, rate, listImageFiles, comment);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(reviewOrderSuccess());
                // dispatch(fetchAllOrders()); // Recall API lấy lại all orders
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Đánh giá đơn hàng không thành công!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Đánh giá đơn hàng không thành công!");
        }
    };
};
// Fetch chi tiết đơn hàng = orderCode
const fetchOrderInTransitByOrderCodeSuccess = (data) => {
    return {
        type: types.FETCH_ORDER_IN_TRANSIT_SUCCESS,
        dataOrderDetail: data
    };
};
const fetchOrderInTransitByOrderCode = (orderCode) => {
    return async (dispatch, getState) => {
        try {
            // console.log('orderCode: ', orderCode);
            const resOrder = await fetchOrderInTransitByOrderCodeService(orderCode);
            const dataOrderDetail = resOrder && resOrder.data ? resOrder.data.data : {};
            if (dataOrderDetail.shipperId !== 0) {
                const resShipper = await fetchShipperDetailByIdService(dataOrderDetail.shipperId);
                const dataShipperDetail = resShipper && resShipper.data ? resShipper.data.data : {};
                dataOrderDetail['shipperDetail'] = dataShipperDetail;
            }
            // console.log('>>> đơn hàng đang giao: ', dataOrderDetail)
            dispatch(fetchOrderInTransitByOrderCodeSuccess(dataOrderDetail));
        } catch (error) {
            console.log(error);
        }
    }
};
// Lấy tất cả vouchers
const fetchVouchersSuccess = (data) => {
    return {
        type: types.FETCH_VOUCHER_SUCCESS,
        dataVouchers: data
    };
};
const fetchVouchers = () => {
    return async (dispatch, getState) => {
        try {
            const res = await fetchVouchersService();
            const data = res && res.data && res.data.data ? res.data.data : [];
            dispatch(fetchVouchersSuccess(data));
            // let listVoucherUnUsed = data.filter(voucher => voucher.used === false);
            // dispatch(fetchVouchersSuccess(listVoucherUnUsed));
        } catch (error) {
            console.log(error);
            // toast.error('Có lỗi ở Server!');  // BE return status=400 -> Lỗi do BE nên chạy vô catch error ni
        }
    }
};
// list sản phẩm yêu thích -> Nếu đã login
const fetchFavouriteProducsRequest = (data) => {
    return {
        type: types.FETCH_FAVOURITE_PRODUCT_REQUEST,

    };
};
const fetchFavouriteProducsSuccess = (data) => {
    return {
        type: types.FETCH_FAVOURITE_PRODUCT_SUCCESS,
        dataProducts: data
    };
};
const fetchFavouriteProducs = (idUser) => {
    return async (dispatch, getState) => {
        try {
            dispatch(fetchFavouriteProducsRequest());
            const res = await fetchFavouriteProducsService(idUser);
            const data = res && res.data ? res.data : []; // list productIds
            if (data) {
                // Sử dụng Promise.all -> call API cho mỗi productId
                const listProductDetails = await Promise.all(
                    data.map(async (productId) => {
                        const productRes = await fetchProductByIdService(productId);
                        return productRes?.data?.data ? productRes.data.data[0] : null;
                    })
                );
                // Lọc bỏ những phần tử null nếu có lỗi trong khi fetch product detail
                const validProducts = listProductDetails.filter(product => product !== null);
                // console.log('validProducts: ', validProducts);
                // Dispatch action với danh sách sản phẩm
                dispatch(fetchFavouriteProducsSuccess(validProducts));
            }
            else {
                dispatch(fetchFavouriteProducsSuccess({}));
            }
        } catch (error) {
            console.log(error);
            dispatch(fetchFavouriteProducsSuccess({}));
        }
    }
};

// save voucher
const saveVoucherSuccess = () => {
    return {
        type: types.SAVE_VOUCHER_SUCCESS,
    };
};
const saveVoucher = (voucherId) => {
    return async (dispatch, getState) => {
        try {
            const res = await saveVoucherService(voucherId);
            const isSuccess = res?.data?.success ? res.data.success : false;
            if (isSuccess) {
                dispatch(fetchVouchers());
                dispatch(saveVoucherSuccess());
                toast.success(res.data.message);
            }
            else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
};

export {
    updateProfile,
    addToCartProduct,
    addToCartCombo,
    fetchProductsInCart,
    placeOrderUsingBuyNow, // modal page
    placeOrderComboUsingBuyNow,
    placeOrderUsingAddToCart, // modal page
    placeOrderBuyNow, // checkout page: product 
    placeOrderComboBuyNow, // checkout page: combo 
    placeOrderAddToCart,
    resetAllUser,
    removeProductInCart,
    increaseOneQuantity,
    decreaseOneQuantity,
    fetchAllOrders,
    cancelOrder,
    reviewOrder,
    fetchOrderInTransitByOrderCode,
    fetchVouchers,
    fetchFavouriteProducs,
    saveVoucher
};
