// reducers/modalReducer.js
const initialState = {
    isLoginModalVisible: false,
    isRegisterModalVisible: false,
};

const modalReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_LOGIN_MODAL':
            return { ...state, isLoginModalVisible: true };
        case 'HIDE_LOGIN_MODAL':
            return { ...state, isLoginModalVisible: false };
        case 'SHOW_REGISTER_MODAL':
            return { ...state, isRegisterModalVisible: true };
        case 'HIDE_REGISTER_MODAL':
            return { ...state, isRegisterModalVisible: false };
        default:
            return state;
    }
};

export default modalReducer;
