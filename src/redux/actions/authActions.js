import types from "../types";
import {
    registerNewUserService,
    loginUserService,
    logoutUserService,
    loginGoogleService,
    getUserAccountService,
    sendOTPService,
    verifyOTPService,
    changePasswordUserService,
    addPhoneNumberService
} from "../../services/authService";
import { hideAddPhoneNumberModal } from "./modalActions";
import { toast } from "react-toastify";
import { resetAllUser, fetchProductsInCart } from "./userActions";

// Register New User
const registerNewUserSuccess = () => {
    return {
        type: types.REGISTER_NEW_USER_SUCCESS,
    };
};
const registerNewUserError = (errorMessage) => {
    return {
        type: types.REGISTER_NEW_USER_ERROR,
    };
};
const registerNewUser = (fullName, password, phoneNumber, email, address) => {
    return async (dispatch) => {
        try {
            const res = await registerNewUserService(fullName, password, phoneNumber, email, address);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(registerNewUserSuccess());
                toast.success(res.data.message);
            } else {
                dispatch(registerNewUserError(res.data.message || "Registration failed."));
                toast.error(res.data.message || "Registration failed.");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response && error.response.data ? error.response.data.message : "An error occurred.";
            dispatch(registerNewUserError(errorMessage));
            toast.error(errorMessage);
        }
    };
};
// Login User phone number
const loginUserSuccess = (userInfo) => {
    return {
        type: types.LOGIN_USER_SUCCESS,
        account: userInfo
    };
};
const loginUserError = () => {
    return {
        type: types.LOGIN_USER_ERROR,

    };
};
const loginUser = (phonenumber, password) => {
    return async (dispatch) => {
        try {
            const res = await loginUserService(phonenumber, password);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(loginUserSuccess(res.data.data));
                localStorage.setItem("token", res.data.data.token);
                toast.success(res.data.message);
                // Đợi token được thiết lập xong trước khi fetch sản phẩm trong giỏ hàng
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } else {
                toast.error(res.data.message || "Đăng nhập thất bại.");
                dispatch(loginUserError());
            }
        } catch (error) {
            console.log(error);
            // Xử lý thông báo lỗi nếu có phản hồi từ server
            const errorMessage = error.response && error.response.data
                ? error.response.data.message
                : "Đã xảy ra lỗi khi đăng nhập.";
            // Hiển thị thông báo lỗi
            toast.error(errorMessage);
            dispatch(loginUserError());
        }
    };
};

// update account AUTH
const updateAccountAuthSuccess = (userInfo) => {
    return {
        type: types.AUTH_UPDATE_ACCOUNT,
        accountInfo: userInfo
    };
};
const updateAccountAuth = (fullName, avatar, email, address) => {
    return (dispatch) => {
        dispatch(updateAccountAuthSuccess({ fullName, avatar, email, address }));
    };
};
// logout user
const logoutUserSuccess = () => {
    return {
        type: types.LOGOUT_USER,
    };
};
const logoutUser = () => {
    return async (dispatch) => {
        // const res = await logoutUserService();
        toast.success('Đăng xuất thành công!');
        dispatch(logoutUserSuccess()); // auth action
        dispatch(resetAllUser()); // user action
    };
};

// login google
const loginGoogleSuccess = () => {
    return {
        type: types.LOGIN_GOOGLE_SUCCESS,
    };
};
const loginGoogleError = () => {
    return {
        type: types.LOGIN_GOOGLE_ERROR,
    };
};
const loginGoogle = (tokenGoogle) => {
    return async (dispatch) => {
        try {
            const res = await loginGoogleService(tokenGoogle);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(loginGoogleSuccess());
                localStorage.setItem("token", res.data.data.token);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Đăng nhập thất bại.");
                dispatch(loginGoogleError());
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response && error.response.data
                ? error.response.data.message
                : "Đã xảy ra lỗi khi đăng nhập.";
            toast.error(errorMessage);
            dispatch(loginGoogleError());
        }
    };
};
// get user account infor => Refresh Page
const getUserAccountSuccess = (userInfo) => {
    return {
        type: types.FETCH_USER_ACCOUNT_SUCCESS,
        accountInfo: userInfo
    };
};
const getUserAccount = () => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const res = await getUserAccountService();
                const isSuccess = res && res.data ? res.data.success : false;
                if (isSuccess) {
                    dispatch(getUserAccountSuccess(res.data.data));
                    // toast.success(res.data.message);
                } else {
                    dispatch({ type: 'FETCH_USER_ACCOUNT_ERROR' });
                }
            }
            else {
                dispatch({ type: 'FETCH_USER_ACCOUNT_ERROR' });
            }
        } catch (error) {
            console.log(error);
            dispatch({ type: 'FETCH_USER_ACCOUNT_ERROR' });
        }
    };
};
// send otp (forget password)
const sentOTPSuccess = () => {
    return {
        type: types.SENT_OTP_SUCCESS,
    };
};
const sendOTP = (email) => {
    return async (dispatch) => {
        try {
            const res = await sendOTPService(email);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(sentOTPSuccess());
                toast.success('Gửi OTP thành công!');
            } else {
                toast.error(res.data.message || "Email không hợp lệ");
            }
        } catch (error) {
            console.log(error);
            toast.error("Email không hợp lệ");
        }
    };
};
// verify otp (forget password)
const verifyOTPSuccess = () => {
    return {
        type: types.VERIFY_OTP_SUCCESS,
    };
};
const verifyOTP = (email, otp, newPassword) => {
    return async (dispatch) => {
        try {
            const res = await verifyOTPService(email, otp, newPassword);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(verifyOTPSuccess());
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Xác nhận OTP không thành công!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Xác nhận OTP không thành công!");
        }
    };
};
// add phone
const addPhoneNumberSuccess = () => {
    return {
        type: types.ADD_PHONE_NUMBER_SUCCESS,
    };
};
const addPhoneNumber = (phoneNumber) => {
    return async (dispatch) => {
        try {
            const res = await addPhoneNumberService(phoneNumber);
            console.log('>>> res add phone: ', res);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(addPhoneNumberSuccess());
                dispatch(hideAddPhoneNumberModal());
                toast.success(res.data.message ||'Thêm số điện thoại thành công!');
                dispatch(getUserAccount());
            } else {
                toast.error(res.data.message || "Số điện thoại không hợp lệ");
            }
        } catch (error) {
            console.log(error);
            toast.error("Số điện thoại không hợp lệ");
        }
    };
};
// Change password
const changePasswordUserSuccess = () => {
    return {
        type: types.CHANGE_PASSWORD_USER_SUCCESS,
    };
};
const changePasswordUser = (oldPassword, newPassword) => {
    return async (dispatch) => {
        try {
            const res = await changePasswordUserService(oldPassword, newPassword);
            const isSuccess = res && res.data ? res.data.success : false;
            if (isSuccess) {
                dispatch(changePasswordUserSuccess());
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Thay đổi mật khẩu thất bại.");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response && error.response.data
                ? error.response.data.message
                : "Đã xảy ra lỗi khi đổi mật khẩu.";
            toast.error(errorMessage);
        }
    };
};
export {
    registerNewUser,
    loginUser,
    updateAccountAuth,
    logoutUser,
    loginGoogle,
    getUserAccount,
    sendOTP,
    verifyOTP,
    changePasswordUser,
    addPhoneNumber
};
