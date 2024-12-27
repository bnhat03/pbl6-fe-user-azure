import React from 'react';
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from './PrivateRoutes';
import Home from '../pages/Home/Home';
import Introduce from '../pages/Introduce/Introduce';
import Category from '../pages/Category/Category';
import Promotion from '../pages/Promotion/Promotion';
import Cart from '../pages/Cart/Cart';
import Contact from '../pages/Contact/Contact';
import Account from '../pages/Account/Account';
import ProductItemDetail from '../components/ProductItemDetail/ProductItemDetail';
import Store from '../pages/Store/Store';
import StoreDetail from '../pages/StoreDetail/StoreDetail';
import Checkout from '../pages/Checkout/Checkout';
import OrderComplete from '../pages/OrderComplete/OrderComplete';
import PromotionDetail from '../pages/PromotionDetail/PromotionDetail';
import OAuth2RedirectHandler from '../components/OAuth2RedirectHandler/OAuth2RedirectHandler';
import RouteMap from '../components/RouteMap/RouteMap';
import DeliveryMap from '../components/DeliveryMap/DeliveryMap';
import Combo from '../pages/Combo/Combo';
import ComboItemDetail from '../components/ComboItemDetail/ComboItemDetail';
import Download from '../pages/Download/Download';
import AllProducts from '../pages/AllProducts/AllProducts';
import Loading from '../pages/Loading/Loading';
import RouteMap2 from '../components/RouteMap2/RouteMap2';
import Checkout_V2 from '../pages/Checkout_V2/Checkout_V2';
import DeliveryMap_V2 from '../components/DeliveryMap_V2/DeliveryMap_V2';
import LoginRoute from './LoginRoute';
import RegisterRoute from './RegisterRoute';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes = (props) => {
    return (
        <>
            <Routes>
                {/* PrivateRoutes */}
                <Route path='/cart' element={<PrivateRoutes element={<Cart />} />} />
                <Route path='/account/*' element={<PrivateRoutes element={<Account />} />} />
                <Route path='/checkout' element={<PrivateRoutes element={<Checkout_V2 />} />} />               
                <Route path='/order-complete' element={<PrivateRoutes element={<OrderComplete />} />} />
                <Route path='/order-in-transit/:orderCode' element={<PrivateRoutes element={<DeliveryMap_V2 />} />} />

                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<Introduce />} />
                <Route path="/category/:id" element={<Category />} />
                <Route path="/combo" element={<Combo />} />
                <Route path="/all-products" element={<AllProducts />} />
                <Route path="/promotion" element={<Promotion />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product-detail/:id" element={<ProductItemDetail />} />
                <Route path="/combo-detail/:id" element={<ComboItemDetail />} />
                <Route path="/store" element={<Store />} />
                <Route path="/store-detail/:id" element={<StoreDetail />} />
                <Route path="/promotion-detail/:id" element={<PromotionDetail />} />
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                <Route path="/download" element={<Download />} />
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/register" element={<RegisterRoute />} />
                {/* <Route path="/store" element={<Store_Old />} /> */}
                {/* <Route path="/cart" element={<Cart />} /> */}
                {/* <Route path="/order" element={<PlaceOrder />} /> */}
                {/* <Route path="/account/*" element={<Account />} /> */}
                {/* <Route path="/checkout" element={<Checkout />} /> */}
                {/* <Route path="/order-complete" element={<OrderComplete />} /> */}
                {/* <Route path="/order-in-transit/:orderCode" element={<DeliveryMap />} /> */}
                {/* <Route path="/test-map" element={<RouteMap/>} /> */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default AppRoutes;