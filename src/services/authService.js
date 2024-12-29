import instance from "../setup/instanceAxios";

const registerNewUserService = (fullName, password, phoneNumber, email, address) => {
    return instance({ // return response: Object
        method: 'post',
        url: '/api/v1/auth/register-user',
        data: {
            fullName, password, phoneNumber, email, address
        }
    });
}
const loginUserService = (numberPhone, password) => {
    return instance({ // return response: Object
        method: 'post',
        url: '/api/v1/auth/login',
        data: {
            numberPhone, password
        }
    });
}
const logoutUserService = () => {
    return instance({
        method: 'post',
        url: `/api/v1/auth/logout`,
    });
}
const loginGoogleService = (tokenGoogle) => {
    return instance({
        method: 'post',
        url: `/api/v1/auth/login/google`,
        data: {
            token: tokenGoogle
        }
    });
}
const getUserAccountService = () => {  // Lấy account infor => Xử lý khi Refresh Page
    return instance({
        method: 'get',
        url: `/api/v1/user/auth/profile`,
    });
}
// forget password
const sendOTPService = (email) => {
    return instance({
        method: 'post',
        url: `/api/v1/auth/send-otp?email=${email}`,
    });
}
const verifyOTPService = (email, otp, newPassword) => {
    return instance({
        method: 'post',
        url: `/api/v1/auth/confirm-otp?email=${email}&otp=${otp}&newPassword=${newPassword}`,
    });
}
const changePasswordUserService = (oldPassword, newPassword) => {
    return instance({
        method: 'post',
        url: `/api/v1/user/auth/reset-password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
    });
}
const addPhoneNumberService = (phoneNumber) => {
    return instance({
        method: 'put',
        url: `/api/v1/user/auth/profile/add-phone?phone=${phoneNumber}`,
    });
}
export {
    registerNewUserService,
    loginUserService,
    logoutUserService,
    loginGoogleService,
    getUserAccountService,
    sendOTPService,
    verifyOTPService,
    changePasswordUserService,
    addPhoneNumberService,

}