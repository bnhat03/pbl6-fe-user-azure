import React from 'react';
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {  showRegisterModal } from '../redux/actions/modalActions';

const RegisterRoute = () => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.auth.isAuthenticated);
    if (isLogin === true) {
        return <Navigate to="/" />;
    } else {
        dispatch(showRegisterModal());
        return <Navigate to="/" />;
    }
};

export default RegisterRoute;
