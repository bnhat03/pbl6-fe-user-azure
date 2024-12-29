import instance from "../setup/instanceAxios"; // an instance of axios
import axios from "axios";
const updateProfileService = (fullName, phonenumber, avatar, email, address) => {
    const formData = new FormData();
    if (fullName) formData.append('fullName', fullName);
    // if (phonenumber) formData.append('phonenumber', phonenumber);
    if (avatar) formData.append('avatar', avatar); // Thêm tệp avatar
    if (email) formData.append('email', email);
    if (address) formData.append('address', address);
    console.log('>>> check: ', phonenumber);
    return instance({
        method: 'put',
        url: '/api/v1/user/auth/profile/update',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data' // Đặt header đúng
        }
    });
}

const addProductToCartService = (productId, quantity, storeId, size, status) => {
    return instance({
        method: 'post',
        url: '/api/v1/user/cart/add/product',
        data: {
            productId, quantity, storeId, size, status
        }
    });
}
const addComboToCartService = (comboId, quantity, storeId, size, status, drinkIdAction) => {
    // console.log('drinkd:', drinkIdAction);
    return instance({
        method: 'post',
        url: '/api/v1/user/cart/add/combo',
        data: {
            comboId, quantity, storeId, size, status, drinkId: [drinkIdAction] //BE y/c truyền array drinks
        }
    });
}
const fetchProductsInCartService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/user/cart/history`,
    });
}
const placeOrderService = () => {
    return instance({
        // method: 'post',
        // url: `/api/v1/user/`,
    });
}
const removeProductInCartService = (cartId) => {
    return instance({
        method: 'delete',
        url: `/api/v1/user/cart/delete/${cartId}`,
    });
}
const increaseOneQuantityService = (cartId, quantity) => {
    return instance({
        method: 'put',
        url: `/api/v1/user/cart/update?cartId=${cartId}&quantity=${quantity}`,
    });
}
const decreaseOneQuantityService = (cartId, quantity) => {
    return instance({
        method: 'put',
        url: `/api/v1/user/cart/update?cartId=${cartId}&quantity=${quantity}`,
    });
}


// note: Mua ngay -> status = 3: Đơn hàng đã được xác nhận
//       Giỏ hàng -> status = 1: Đơn hàng mới
// => Phân biệt rứa à bay??
const placeOrderBuyNowService = (paymentMethod, productDetailBuyNow, address, longitude, latitude, voucher) => {
    // if (paymentMethod === 'CASH') {
    const data = {
        paymentMethod,
        productId: productDetailBuyNow.product.productId,
        storeId: productDetailBuyNow.store.storeId,
        quantity: productDetailBuyNow.quantity,
        size: productDetailBuyNow.size,
        deliveryAddress: address,
        longitude,
        latitude,
        ...(voucher && { discountCode: voucher.code }) // Có voucher mới thêm vô body
    };
    return instance({
        method: 'post',
        url: `/api/v1/user/order/create/now`,
        data
    });
    // }
    // else { // ZALOPAY
    //     return instance({
    //         method: 'post',
    //         url: `/api/v1/user/order/create/now`,
    //         data: {
    //             paymentMethod,
    //             productId: productDetailBuyNow.product.productId,
    //             storeId: productDetailBuyNow.store.storeId,
    //             quantity: productDetailBuyNow.quantity,
    //             size: productDetailBuyNow.size,
    //             deliveryAddress: address,
    //             longitude,
    //             latitude
    //         }
    //     });
    // }
}
const placeOrderComboBuyNowService = (paymentMethod, comboDetailBuyNow, address, longitude, latitude, voucher) => {
    const data = {
        paymentMethod,
        comboId: comboDetailBuyNow.combo.comboId,
        drinkId: [comboDetailBuyNow.drink.productId],
        storeId: comboDetailBuyNow.store.storeId,
        quantity: comboDetailBuyNow.quantity,
        size: comboDetailBuyNow.size,
        deliveryAddress: address,
        longitude,
        latitude,
        ...(voucher && { discountCode: voucher.code })
    }
    return instance({
        method: 'post',
        url: `/api/v1/user/order/create/now`,
        data
    });
    // if (paymentMethod === 'CASH') {
    //     // console.log('>>> mua gio hang moi combo: ', comboDetailBuyNow);
    //     return instance({
    //         method: 'post',
    //         url: `/api/v1/user/order/create/now`,
    //         data: {
    //             paymentMethod,
    //             comboId: comboDetailBuyNow.combo.comboId,
    //             drinkId: [comboDetailBuyNow.drink.productId],
    //             storeId: comboDetailBuyNow.store.storeId,
    //             quantity: comboDetailBuyNow.quantity,
    //             size: comboDetailBuyNow.size,
    //             deliveryAddress: address,
    //             longitude,
    //             latitude
    //         }
    //     });
    // }
    // else { // ZALOPAY
    //     return instance({
    //         method: 'post',
    //         url: `/api/v1/user/order/create/now`,
    //         data: {
    //             paymentMethod,
    //             comboId: comboDetailBuyNow.combo.comboId,
    //             drinkId: [comboDetailBuyNow.drink.productId],
    //             storeId: comboDetailBuyNow.store.storeId,
    //             quantity: comboDetailBuyNow.quantity,
    //             size: comboDetailBuyNow.size,
    //             deliveryAddress: address,
    //             longitude,
    //             latitude
    //         }
    //     });
    // }
}
const placeOrderAddToCartService = (paymentMethod, cartIds, address, longitude, latitude, voucher) => {
    const data = {
        cartIds,
        deliveryAddress: address,
        longitude,
        latitude,
        paymentMethod,
        ...(voucher && { discountCode: voucher.code })
    }
    return instance({
        method: 'post',
        url: `/api/v1/user/order/create`,
        data
    });

    // if (paymentMethod === 'CASH') {
    //     return instance({
    //         method: 'post',
    //         url: `/api/v1/user/order/create`,
    //         data: {
    //             cartIds,
    //             deliveryAddress: address,
    //             longitude,
    //             latitude,
    //             paymentMethod
    //         }
    //     });
    // }
    // else { // ZALOPAY
    //     return instance({
    //         method: 'post',
    //         url: `/api/v1/user/order/create`,
    //         data: {
    //             cartIds,
    //             deliveryAddress: address,
    //             longitude,
    //             latitude,
    //             paymentMethod
    //         }
    //     });
    // }
}
const fetchAllOrdersService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/user/order/history`,
    });
}
const cancelOrderService = (orderCode) => {
    return instance({
        method: 'post',
        url: `/api/v1/user/order/cancel/${orderCode}`,
    });
}
const reviewOrderService = (listProductIds, listComboIds, rate, listImageFiles, comment) => {
    const formData = new FormData();
    formData.append('productId', listProductIds);
    formData.append('comboId', listComboIds);
    formData.append('rate', rate);
    // formData.append('imageFiles', listImageFiles);
    listImageFiles.forEach((file, index) => {
        formData.append('imageFiles', file);  // Thêm từng file ảnh vào FormData
    });
    formData.append('comment', comment);
    return instance({
        method: 'post',
        url: `/api/v1/user/product/rating`, // Đánh giá luôn cho cả product + combo
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const fetchOrderInTransitByOrderCodeService = (orderCode) => {
    return instance({
        method: 'get',
        url: `/api/v1/user/order/history/${orderCode}`,
    });
}
const fetchShipperDetailByIdService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/user/${id}`,
    });
}

const fetchUserDetailByIdService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/user/${id}`,
    });
}
const fetchVouchersService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/user/voucher/get`,
    });
}
const fetchFavouriteProducsService = (idUser) => {
    let urlAI = import.meta.env.VITE_AI_URL;
    return axios({
        method: 'get',
        url: `${urlAI}/cross-sell/${+idUser}`,
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' // Bỏ qua cảnh báo của Ngrok
        }
    });
    // return axios.get(`${urlAI}/cross-sell/${idUser}`);
}
const saveVoucherService = (voucherId) => {
    return instance({
        method: 'post',
        url: `/api/v1/user/voucher/apply?voucherId=${voucherId}`,
    });
}


export {
    updateProfileService,
    addProductToCartService,
    addComboToCartService,
    fetchProductsInCartService,
    placeOrderService,
    removeProductInCartService,
    increaseOneQuantityService,
    placeOrderBuyNowService,
    placeOrderComboBuyNowService,
    placeOrderAddToCartService,
    fetchAllOrdersService,
    cancelOrderService,
    reviewOrderService,
    fetchOrderInTransitByOrderCodeService,
    fetchShipperDetailByIdService,
    fetchUserDetailByIdService,
    decreaseOneQuantityService,
    fetchVouchersService,
    fetchFavouriteProducsService,
    saveVoucherService,
}