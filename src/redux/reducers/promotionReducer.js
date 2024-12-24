import types from "../types";

const INITIAL_STATE = {
    listPromotions: [],
    listVouchersStore: [],

};

const promotionReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.FETCH_PROMOTION_SUCCESS:
            return {
                ...state,
                listPromotions: action.dataPromotions,
            };

        default: return state;
        case types.FETCH_PROMOTION_BY_ID_SUCCESS:
            return {
                ...state,
                promotionDetail: action.promotionDetail,
            };
        case types.FETCH_VOUCHER_BY_ID_STORE_SUCCESS:
            return {
                ...state,
                listVouchersStore: action.dataVouchers,
            };
    }

};

export default promotionReducer; 
