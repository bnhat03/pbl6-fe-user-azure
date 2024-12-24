import React from 'react';
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { showLoginModal } from '../redux/actions/modalActions';

const PrivateRoutes = ({ element }) => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.auth.isAuthenticated);

    if (isLogin === true) {
        // Nếu người dùng đã xác thực, trả về element của route
        return element;
    } else {
        // Nếu chưa xác thực, hiển thị modal login và điều hướng
        dispatch(showLoginModal());
        return <Navigate to="/" />;
    }
};

export default PrivateRoutes;
