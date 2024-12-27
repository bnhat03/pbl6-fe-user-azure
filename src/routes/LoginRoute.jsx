import React from 'react';
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { showLoginModal } from '../redux/actions/modalActions';

const LoginRoute = () => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.auth.isAuthenticated);
    if (isLogin === true) {
        return <Navigate to="/" />;
    } else {
        dispatch(showLoginModal());
        return <Navigate to="/" />;
    }
};

export default LoginRoute;
