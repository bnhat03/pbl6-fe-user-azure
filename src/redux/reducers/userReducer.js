// reducers/authReducer.js
const initialState = {
    isLoadingListFavouriteProducts: false,


    listProductsInCart: {}, // list products ở giỏ hàng khách hàng => fetch từ BE
    listCombosInCart: {},

    listProductsSelectInCart: {}, // list products chọn để mua ở trang Cart -> checkout
    listCombosSelectInCart: {}, // list combos chọn để mua ở trang Cart -> checkout
    selectedStore: {}, //store chọn để mua ở trang Cart -> checkout
    isBuyNow: false,
    isBuyNowCombo: false,
    productDetailBuyNow: {},
    comboDetailBuyNow: {},
    allOrders: {},
    orderInTransit: {},
    listVouchersUser: {},
    listFavouriteProducts: [], // list sản phẩm yêu thích của user => Nếu login mới có

};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_PROFILE_SUCCESS':
            return { ...state };
        case 'UPDATE_PROFILE_ERROR':
            return { ...state };
        case 'ADD_TO_CART_SUCCESS':
            return { ...state };
        case 'ADD_TO_CART_ERROR':
            return { ...state };
        case 'FETCH_PRODUCT_CART_SUCCESS':
            return {
                ...state,
                listProductsInCart: action.dataProducts,
                listCombosInCart: action.dataCombos
            };
        case 'BUY_NOW_OPTION': // Nhấn mua ngay PRODUCT
            return {
                ...state,
                productDetailBuyNow: action.productDetail,
                selectedStore: action.dataSelectedStore,
                isBuyNow: true,
                isBuyNowCombo: false,
            }
        case 'BUY_NOW_COMBO_OPTION': // Nhấn mua ngay COMBO
            return {
                ...state,
                comboDetailBuyNow: action.comboDetail,
                selectedStore: action.dataSelectedStore,
                isBuyNow: false,
                isBuyNowCombo: true,
            }
        case 'ADD_TO_CART_OPTION': // Nhấn thanh toán trong Cart
            return {
                ...state,
                listProductsSelectInCart: action.dataProducts,
                listCombosSelectInCart: action.dataCombos,
                selectedStore: action.dataSelectedStore,
                isBuyNow: false,
                isBuyNowCombo: false,
            }
        case 'PLACE_ORDER_BUY_NOW_SUCCESS':
            return {
                ...state,
                productDetailBuyNow: {},
            }
        case 'PLACE_ORDER_BUY_NOW_ERROR':
            return {
                ...state,
            }
        case 'PLACE_ORDER_ADD_TO_CART_SUCCESS':
            return {
                ...state,
                listProductsSelectInCart: {},
                listCombosSelectInCart: {},
                selectedStore: {}
            }
        case 'PLACE_ORDER_ADD_TO_CART_ERROR':
            return {
                ...state,
            }
        case 'RESET_ALL_USER':
            return {
                ...initialState,
            };
        case 'REMOVE_PRODUCT_IN_CART_SUCCESS':
            return {
                ...state
            };
        case 'INCREASE_ONE_QUANTITY_SUCCESS':
            return {
                ...state
            };
        case 'FETCH_ALL_ORDERS_SUCCESS':
            return {
                ...state,
                allOrders: action.dataOrders,
            };
        case 'CANCEL_ORDER_SUCCESS':
            return {
                ...state,
            };
        case 'REVIEW_ORDER_SUCCESS':
            return {
                ...state,
            };
        case 'FETCH_ORDER_IN_TRANSIT_SUCCESS':
            return {
                ...state,
                orderInTransit: action.dataOrderDetail
            };
        case 'FETCH_VOUCHER_SUCCESS':
            return {
                ...state,
                listVouchersUser: action.dataVouchers
            };
        case 'FETCH_FAVOURITE_PRODUCT_REQUEST':
            return {
                ...state,
                isLoadingListFavouriteProducts: true
            };
        case 'FETCH_FAVOURITE_PRODUCT_SUCCESS':
            return {
                ...state,
                listFavouriteProducts: action.dataProducts,
                isLoadingListFavouriteProducts: false,
            };
        case 'SAVE_VOUCHER_SUCCESS':
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default userReducer;
