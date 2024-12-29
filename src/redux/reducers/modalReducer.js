// reducers/modalReducer.js
const initialState = {
    isLoginModalVisible: false,
    isRegisterModalVisible: false,
    isAddPhoneModalVisible: false,
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
        case 'SHOW_ADD_PHONE_NUMBER_MODAL':
            return { ...state, isAddPhoneModalVisible: true };
        case 'HIDE_ADD_PHONE_NUMBER_MODAL':
            return { ...state, isAddPhoneModalVisible: false };
        default:
            return state;
    }
};

export default modalReducer;
