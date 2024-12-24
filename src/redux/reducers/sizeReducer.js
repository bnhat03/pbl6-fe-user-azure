import types from "../types";

const INITIAL_STATE = {
    listSizes: [],
};

const sizeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.FETCH_SIZE_SUCCESS:
            return {
                ...state,
                listSizes: action.dataSizes,
            };

        default: return state;

    }

};

export default sizeReducer; 
