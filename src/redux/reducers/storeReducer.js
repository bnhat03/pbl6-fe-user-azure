import types from "../types";

const INITIAL_STATE = {
    listStores: [],
    storeDetail: {}
};

const storeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.FETCH_STORE_SUCCESS:
            return {
                ...state,
                listStores: action.dataStores,

            };
        case types.FETCH_STORE_BY_ID_SUCCESS:
            return {
                ...state,
                storeDetail: action.storeDetail,
            };
        default: return state;

    }

};

export default storeReducer; 
