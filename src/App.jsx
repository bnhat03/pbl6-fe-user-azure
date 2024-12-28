import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/HomeStyle.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from "./routes/AppRoutes";
import LoginModal from "./components/LoginModal/LoginModal";
import RegisterModal from "./components/RegisterModal/RegisterModal";
import { useDispatch, useSelector } from 'react-redux';
import { getUserAccount } from "./redux/actions/authActions";
import { fetchAllProducts, fetchProductsBestSale } from "./redux/actions/productActions";
import { fetchAllCategories } from "./redux/actions/categoryActions";
import { fetchAllPromotions } from "./redux/actions/promotionActions";
import { fetchAllStores } from "./redux/actions/storeActions";
import { fetchAllSizes } from "./redux/actions/sizeActions";
import ChatContext, { ChatProvider } from "./context/showChat";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserAccount());
    // dispatch(fetchAllProducts());
    dispatch(fetchAllCategories());
    dispatch(fetchProductsBestSale());
    dispatch(fetchAllSizes());
    // dispatch(fetchAllPromotions());
    // dispatch(fetchAllStores());
  }, [dispatch]);

  const { isLoading } = useSelector((state) => state.auth); // Redux lưu tất cả state trước khi đến các route
  if (isLoading) {
    return <></>;
  }
  return (
    <>
      <div className="app">
        <ChatProvider>
          <Navbar />
          <AppRoutes />
        </ChatProvider>
        <LoginModal />
        <RegisterModal />
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};
export default App;
