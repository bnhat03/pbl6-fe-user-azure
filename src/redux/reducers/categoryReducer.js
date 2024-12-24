import types from "../types";

const INITIAL_STATE = {
    listCategories: [],
    drinkCategoryId: 0,
    isLoading: false,
    isError: false,
    isCreating: false,
};

const categoryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.FETCH_CATEGORY_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case types.FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                listCategories: action.dataCategories,
                drinkCategoryId: action.drinkCategoryId,
                isLoading: false,
                isError: false
            };
        case types.FETCH_CATEGORY_ERROR:
            return {
                ...state,
                isLoading: false,
                isError: true
            };

        case types.CREATE_CATEGORY_REQUEST:
            return {
                ...state,
                isCreating: true,
            };
        case types.CREATE_CATEGORY_SUCCESS:

            return {
                ...state,
                isCreating: false,
            };
        case types.CREATE_CATEGORY_ERROR:
            return {
                ...state,
                isCreating: false,
            };
        // case DELETE_CATEGORY_SUCCESS:
        //     return {
        //         ...state,
        //     };
        default: return state;

    }

};

export default categoryReducer; 
