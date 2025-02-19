// reducers/authReducer.js
const initialState = {
    isAuthenticated: false, // Đã đăng nhập chưa 
    isLoading: true, // Trạng thái chờ khi xác thực người dùng
    registerNewUserSuccess: false,
    account: {}, // Thông tin account
    isSentOTP: false,
    isVerifyOTPSuccess: false,
    isAddPhoneNumberSuccess: false,
};

const authReducer = (state = initialState, action) => {
    let phoneNumber = '', fullName = '', avatar = '', email = '', address = '', account = {}, id = 0;
    switch (action.type) {
        case 'LOGIN_USER_SUCCESS':
            return { ...state, isAuthenticated: true, account: action.account };
        case 'LOGIN_USER_ERROR':
            return { ...state, isAuthenticated: false };
        case 'REGISTER_NEW_USER_SUCCESS':
            return { ...state, registerNewUserSuccess: true };
        case 'REGISTER_NEW_USER_ERROR':
            return { ...state, registerNewUserSuccess: false };
        case 'AUTH_UPDATE_ACCOUNT':
            account = state.account || {};
            fullName = action.accountInfo.fullName;
            avatar = action.accountInfo.avatar;
            email = action.accountInfo.email;
            address = action.accountInfo.address;
            return { ...state, account: { ...account, fullName, avatar, email, address } };
        case 'LOGOUT_USER':
            // return { ...state, isAuthenticated: false, account: {} };
            return { ...initialState, isLoading: false };
        case 'LOGIN_GOOGLE_SUCCESS':
            return { ...state, isAuthenticated: true };
        case 'LOGIN_GOOGLE_ERROR':
            return { ...state, isAuthenticated: false };
        case 'FETCH_USER_ACCOUNT_SUCCESS':
            account = state.account || {};
            id = action.accountInfo.id;
            phoneNumber = action.accountInfo.phoneNumber;
            fullName = action.accountInfo.fullName;
            avatar = action.accountInfo.avatar;
            email = action.accountInfo.email;
            address = action.accountInfo.address;
            return { ...state, isLoading: false, isAuthenticated: true, account: { ...account, id, phoneNumber, fullName, avatar, email, address } };
        case 'FETCH_USER_ACCOUNT_ERROR':
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
            };
        case 'SENT_OTP_SUCCESS':
            return { ...state, isSentOTP: true };
        case 'VERIFY_OTP_SUCCESS':
            return { ...state, isVerifyOTPSuccess: true };
        case 'CHANGE_PASSWORD_USER_SUCCESS':
            return { ...state };
        case 'ADD_PHONE_NUMBER_SUCCESS':
                return { ...state, isAddPhoneNumberSuccess: true};
        default:
            return state;
    }
};

export default authReducer;
