import React from 'react';
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { showLoginModal } from '../redux/actions/modalActions';
import PacmanLoader from 'react-spinners/PacmanLoader';

const PrivateRoutes = ({ element }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        // Hiển thị trạng thái chờ khi đang xác thực
        return <></>;
    }
    if (isAuthenticated) {
        // Nếu người dùng đã xác thực, trả về element
        return element;
    } else {
        // Nếu chưa xác thực, điều hướng đến trang chủ và hiển thị modal login
        dispatch(showLoginModal());
        return <Navigate to="/" />;
    }
};

export default PrivateRoutes;
