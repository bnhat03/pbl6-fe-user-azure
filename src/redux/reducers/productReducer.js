import types from "../types";

const INITIAL_STATE = {
    isLoadingListProductsByIdCategory: false,
    isLoadingAllCombos: false,
    isLoadingAllProducts: false,
    isLoadingListProductsBestSale: false,
    isLoadingListProductsByIdStore: false,
    isLoadingListSimilarProducts: false,
    isLoadingListSimilarCombos: false,

    listProductsBestSale: [],
    listProductsByIdCategory: [],
    allCombos: [],
    allProducts: [],
    productDetail: {},  // product đang nhấn để coi chi tiết hiện tại
    comboDetail: {},
    listProductsByIdStore: [],
    ratingProduct: [], // tất cả bài đánh giá product
    ratingCombo: [], // tất cả bài đánh giá combo
    allDrinks: [],
    listSimilarProducts: [], // Danh sách sản phẩm cùng Category với product detail hiện tại
    listSimilarCombos: [], // Danh sách combo với combo detail hiện tại
};

const productReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.FETCH_PRODUCT_BEST_SALE_REQUEST:
            return {
                ...state,
                isLoadingListProductsBestSale: true
            };

        case types.FETCH_PRODUCT_BEST_SALE_SUCCESS:
            // console.log('>>> best sale: ', action.dataProducts);
            return {
                ...state,
                listProductsBestSale: action.dataProducts,
                isLoadingListProductsBestSale: false
            };
        case types.FETCH_PRODUCT_BY_ID_CATEGORY_REQUEST:
            return {
                ...state,
                isLoadingListProductsByIdCategory: true
            };
        case types.FETCH_PRODUCT_BY_ID_CATEGORY_SUCCESS:
            return {
                ...state,
                listProductsByIdCategory: action.dataProducts,
                isLoadingListProductsByIdCategory: false
            };
        case types.FETCH_ALL_COMBO_REQUEST:
            return {
                ...state,
                isLoadingAllCombos: true
            };
        case types.FETCH_ALL_COMBO_SUCCESS:
            return {
                ...state,
                allCombos: action.dataCombos,
                isLoadingAllCombos: false
            };
        case types.FETCH_ALL_DRINK_SUCCESS:
            return {
                ...state,
                allDrinks: action.dataDrinks,
            };
        case types.FETCH_PRODUCT_BY_ID_SUCCESS:
            return {
                ...state,
                productDetail: action.productDetail,
            };
        case types.FETCH_COMBO_BY_ID_SUCCESS:
            return {
                ...state,
                comboDetail: action.comboDetail,
            };
        case types.FETCH_PRODUCT_BY_ID_STORE_REQUEST:
            return {
                ...state,
                isLoadingListProductsByIdStore: true
            };
        case types.FETCH_PRODUCT_BY_ID_STORE_SUCCESS:
            return {
                ...state,
                listProductsByIdStore: action.dataProducts,
                isLoadingListProductsByIdStore: false
            };
        case types.FETCH_RATING_PRODUCT_BY_ID_SUCCESS:
            return {
                ...state,
                ratingProduct: action.dataRatingProduct,
            };
        case types.FETCH_RATING_COMBO_BY_ID_SUCCESS:
            return {
                ...state,
                ratingCombo: action.dataRatingCombo,
            };
        case types.FETCH_SIMILAR_PRODUCT_REQUEST:
            return {
                ...state,
                isLoadingListSimilarProducts: true,
            };
        case types.FETCH_SIMILAR_PRODUCT_SUCCESS:
            return {
                ...state,
                listSimilarProducts: action.dataProducts,
                isLoadingListSimilarProducts: false,
            };
        case types.FETCH_SIMILAR_COMBO_REQUEST:
            return {
                ...state,
                isLoadingListSimilarCombos: true,
            };
        case types.FETCH_SIMILAR_COMBO_SUCCESS:
            return {
                ...state,
                listSimilarCombos: action.dataCombos,
                isLoadingListSimilarCombos: false,
            };
        case types.FETCH_ALL_PRODUCT_REQUEST:
            return {
                ...state,
                isLoadingAllProducts: true
            };
        case types.FETCH_ALL_PRODUCT_SUCCESS:
            return {
                ...state,
                allProducts: action.dataProducts,
                isLoadingAllProducts: false
            };
        default: return state;

    }

};

export default productReducer; 
