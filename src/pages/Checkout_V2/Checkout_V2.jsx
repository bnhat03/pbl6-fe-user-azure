import React, { useState, useEffect, useCallback } from "react";
import "./Checkout.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { placeOrderBuyNow, placeOrderComboBuyNow, placeOrderAddToCart, fetchVouchers } from "../../redux/actions/userActions";
import { toast } from "react-toastify";
import { Form } from 'react-bootstrap';
import L from 'leaflet';
import iconStore from '../../assets/logo/map_store.png'
import iconOrder from '../../assets/logo/map_order.png'
import iconZalopay from '../../assets/logo/zalopay.png'
import iconCash from '../../assets/logo/cash.png'
import iconCurrentLocation from '../../assets/logo/map_current_location.png'
//MAP
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { debounce } from 'lodash';

// Component click  trên map
const LocationMarker = ({ setPosition }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]); // Cập nhật vị trí với tọa độ đã click
        },
    });
    return null;
};

const Checkout_V2 = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // state redux
    const isBuyNow = useSelector((state) => state.user.isBuyNow);
    const isBuyNowCombo = useSelector((state) => state.user.isBuyNowCombo);
    const productDetailBuyNow = useSelector((state) => state.user.productDetailBuyNow);
    const comboDetailBuyNow = useSelector((state) => state.user.comboDetailBuyNow);
    const listProductsSelectInCart = useSelector((state) => state.user.listProductsSelectInCart);
    const listCombosSelectInCart = useSelector((state) => state.user.listCombosSelectInCart);
    const selectedStore = useSelector((state) => state.user.selectedStore);
    const accountInfo = useSelector((state) => {
        return state.auth.account;
    });
    const listVouchersUser = useSelector((state) => state.user.listVouchersUser);
    // state chi phí
    const [selectedVoucherId, setSelectedVoucherId] = useState("0");
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [promotion, setPromotion] = useState(0);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    // Lọc các voucher hợp lệ theo điều kiện selectedStore và used = false
    useEffect(() => {
        if (listVouchersUser && listVouchersUser.length > 0) {
            const vouchers = listVouchersUser ? (listVouchersUser.filter(
                (voucher) => voucher.storeId.includes(+selectedStore.storeId) && !voucher.used
            )) : [];
            setFilteredVouchers(vouchers)
        }
    }, [listVouchersUser]);
    useEffect(() => {
        // Cập nhật `selectedVoucher` và `promotion` khi `selectedVoucherId` thay đổi
        const voucher = filteredVouchers.find(voucher => voucher.voucherId === +selectedVoucherId);
        if (voucher) {
            setSelectedVoucher(voucher);
            setPromotion(+voucher.discountPercent);
        } else { //Ko chọn voucher
            setSelectedVoucher(null);
            setPromotion(0);
        }
    }, [selectedVoucherId, filteredVouchers]);
    // state thông tin nhận hàng
    const [fullname, setFullname] = useState(accountInfo.fullName);
    const [phonenumber, setPhonenumber] = useState(accountInfo.phoneNumber);
    const [address, setAddress] = useState("Địa chỉ của bạn");
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Thanh toán khi nhận hàng");

    const getTotalPriceInCart = () => {
        let total = 0;
        for (let i = 0; i < listProductsSelectInCart.length; i++) {
            total += (listProductsSelectInCart[i].product.unitPrice * listProductsSelectInCart[i].product.quantity);
        }
        for (let i = 0; i < listCombosSelectInCart.length; i++) {
            total += (listCombosSelectInCart[i].combo.unitPrice * listCombosSelectInCart[i].combo.quantity);
        }
        return total;
    }
    const handlePlaceOrder = () => {
        if (!fullname || !phonenumber || !address) {
            toast.error('Vui lòng điền đầy đủ thông tin đơn hàng!');
        }
        // else if (!/^0\d{9}$/.test(phonenumber)){
        //     toast.error('Nhập số điện thoại hợp lệ!');
        // }
        else {
            let method = 'CASH';
            switch (paymentMethod) {
                case 'Thanh toán khi nhận hàng':
                    method = 'CASH';
                    break;
                case 'Momo':
                    method = 'MOMO';
                    break;
                case 'Zalopay':
                    method = 'ZALOPAY';
                    break;
                default:
                    break;
            }
            if (isBuyNow === true && isBuyNowCombo === false) { // Mua ngay PRODUCT
                dispatch(placeOrderBuyNow(method, productDetailBuyNow, address, addressCoords[1], addressCoords[0], navigate, selectedVoucher));
            }
            else if (isBuyNow === false && isBuyNowCombo === true) { // Mua ngay COMBO
                dispatch(placeOrderComboBuyNow(method, comboDetailBuyNow, address, addressCoords[1], addressCoords[0], navigate, selectedVoucher));
            }
            else { // Mua ở giỏ hàng
                const cartIds = [
                    ...(listProductsSelectInCart && listProductsSelectInCart.length > 0 ? listProductsSelectInCart.map(item => item.cartId) : []),
                    ...(listCombosSelectInCart && listCombosSelectInCart.length > 0 ? listCombosSelectInCart.map(item => item.cartId) : [])
                ];

                dispatch(placeOrderAddToCart(method, cartIds, address, addressCoords[1], addressCoords[0], navigate, selectedVoucher));
            }
            dispatch(fetchVouchers());
        }
    };

    // MAP: OpenRouteService
    const [addressCoords, setAddressCoords] = useState([16.075966, 108.149805]); // Tọa độ click -> Chọn giao hàng ở đó -> Trên Map
    const [currentCoords, setCurrentCoords] = useState([16.075966, 108.149805]); // Tọa độ hiện tại của mình

    // Lấy tọa độ hiện tại (Mới vô MAP)
    const getCurrentCoors = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const latLon = [latitude, longitude];
                    setAddressCoords(latLon);
                    setCurrentCoords(latLon);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // alert("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra cài đặt vị trí.");
                },
                {
                    enableHighAccuracy: true,  // Yêu cầu độ chính xác cao
                    timeout: 10000,            // Thời gian tối đa để lấy vị trí (ms)
                    maximumAge: 0              // Luôn lấy vị trí mới nhất
                }
            );

        } else {
            console.error("Trình duyệt của bạn không hỗ trợ lấy vị trí.");
            alert("Trình duyệt của bạn không hỗ trợ lấy vị trí.");
        }
    }
    // Hàm xử lý click trên bản đồ 
    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        setAddressCoords([lat, lng]); // Lưu tọa độ đã click
    };
    // Phóng to bản đồ (Khi chọn vị trí nhận hàng)
    const ZoomToAddress = () => {
        const map = useMap();
        if (addressCoords) {
            map.setView(addressCoords, 18); 
        }
        return null;
    };

    // Tọa độ -> Địa chỉ
    const fetchAddressFromCoordinates = async (latitude, longitude) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        try {
            const response = await axios.get(url);
            if (response?.data?.address) {
                const address = response.data.address; 
                const formattedAddress = [ // Địa chỉ đầy đủ
                    address.road,        // Tên đường,
                    address.village,    // xã
                    address.quarter,     // phường
                    address.county,      // Huyện
                    address.suburb,      // Quận
                    address.city,        // Thành phố
                    address.state,       // Tỉnh
                    address.country      // Quốc gia
                ]
                .filter(Boolean) 
                .join(', '); 
                setAddress(formattedAddress);
            }
        } catch (err) {
            console.error("Error details: ", err);
        }
    };
    const debouncedFetchAddress = useCallback( // không bị tạo lại trong mỗi lần render
        debounce((lat, lon) => {
          fetchAddressFromCoordinates(lat, lon);
        }, 1100), 
        []
    );
    // Tính phí giao hàng dựa vào khoảng cách (đường chim bay)
    const [shippingFee, setShippingFee] = useState(0);
    const [distance, setDistance] = useState(0);
    function toRad(deg) { // độ -> radian
        return deg * (Math.PI / 180);
    }
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // bán kính trái đất (km)
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // (km)
        return distance.toFixed(2); // 2 số thập phân
    }
    // Customize icon markup
    const customIconStore = new L.Icon({
        iconUrl: iconStore,
        iconSize: [40, 40],       
        iconAnchor: [20, 40],     
        popupAnchor: [0, -40],    
    });
    const customIconOrder = new L.Icon({
        iconUrl: iconOrder,
        iconSize: [40, 40],       
        iconAnchor: [20, 40],     
        popupAnchor: [0, -40],    
    });
    const customIconCurrentLocation = new L.Icon({
        iconUrl: iconCurrentLocation,
        iconSize: [30, 30],       
        iconAnchor: [20, 40],     
        popupAnchor: [0, -40],    
    });
    // Mới vô page-> Hiển thị trên input + map => Vị trí hiện tại
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fetchVouchers());
        getCurrentCoors();
    }, []);

    // Click chuột -> Tọa độ thay đổi -> Input address thay đổi
    useEffect(() => {
        if (addressCoords) {       
            debouncedFetchAddress(addressCoords[0],addressCoords[1]);
            let distance = getDistance(addressCoords[0], addressCoords[1], selectedStore ? +selectedStore.latitude : 16.0471, selectedStore ? +selectedStore.longitude : 108.206); // note: thay tọa độ sau bằng tọa độ cửa hàng
            setDistance(distance);
            if (distance > 1.5) {
                const calculatedFee = distance * 10000;
                const roundedFee = Math.floor(calculatedFee / 1000) * 1000;
                setShippingFee(roundedFee);
            }
            else {
                setShippingFee(0);
            }
        }
    }, [addressCoords, selectedStore]);
    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-container">
                    <div className="billing-details">
                        <h2>THÔNG TIN NHẬN HÀNG</h2>
                        <div className="form-group col-md-12">
                            <label htmlFor="">Họ tên</label>
                        </div>
                        <input
                            // className="input-no-change"
                            className="form-control"
                            type="text"
                            placeholder="Họ tên người nhận"
                            value={fullname}
                            disabled={true}
                            // onChange={(e) => setFullname(e.target.value)}
                            required
                        />
                        <div className="form-group col-md-12">
                            <label htmlFor="">Nhập số điện thoại</label>
                            <input
                                // className="input-no-change"
                                className="form-control"
                                type="text"
                                placeholder="Số điện thoại"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                                disabled={accountInfo?.phoneNumber ? true : false}
                                required
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor="">Vị trí nhận hàng</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Địa chỉ"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                // disabled={true}
                                required
                            />
                        </div>
                        <div className="map-container">
                            <MapContainer
                                center={[16.2554, 107.9006]}
                                zoom={9}
                                style={{ height: '400px', width: '100%' }}
                                onClick={handleMapClick} 
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {addressCoords && (
                                    <Marker position={addressCoords} icon={customIconOrder}>
                                        <Popup>
                                            Vị trí giao hàng
                                        </Popup>
                                    </Marker>
                                )}

                                {currentCoords && (
                                    <Marker position={currentCoords} icon={customIconCurrentLocation}>
                                        <Popup>
                                            Vị trí hiện tại của bạn
                                        </Popup>
                                    </Marker>
                                )}
                                <Marker position={[selectedStore?.latitude ? +selectedStore.latitude : 16.0471, selectedStore?.longitude ? +selectedStore.longitude : 108.206]} icon={customIconStore}>
                                    <Popup>Vị trí của cửa hàng</Popup>
                                </Marker>
                                <LocationMarker setPosition={setAddressCoords} /> {/* Cập nhật vị trí đã click */}
                                <ZoomToAddress /> 
                            </MapContainer>
                        </div>
                        {/* <div className="form-group col-md-12">
                            <label htmlFor="">Ghi chú</label>
                            <textarea
                                name="note"
                                placeholder="Ghi chú (tùy chọn)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div> */}
                    </div>

                    <div className="order-summary">
                        <h3>ĐƠN HÀNG CỦA BẠN</h3>
                        <div className="order-item">
                            <span>Sản phẩm</span>
                            <span>Tổng tiền</span>
                        </div>
                        <div className="order-detail-product">
                            {
                                isBuyNow === false && isBuyNowCombo === false ? ( // Mua trong giỏ hàng
                                    <>
                                        {listProductsSelectInCart && listProductsSelectInCart.length > 0 && listProductsSelectInCart.map((item, index) => (
                                            <div className="order-detail-product-item" key={index}>
                                                <div className="product-item-infor">
                                                    <div className="product-item-image">
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${item.product.image}`} alt="" />
                                                    </div>
                                                    <div className="product-item-infor">
                                                        <p className="infor-name">{item.product.productName} ({item.product.size})</p>
                                                        <div className="infor-price-quantity">
                                                            <p className="infor-price">
                                                                {Number(item.product.unitPrice).toLocaleString('vi-VN')} đ
                                                            </p>
                                                            <p className="px-2">x</p>
                                                            <p className="infor-quantity">{item.product.quantity}</p>
                                                        </div>
                                                        <p className="infor-store">Cửa hàng: {item.product.storeId}</p>
                                                    </div>
                                                </div>
                                                <div className="product-item-totalprice">
                                                    <span>{Number(item.product.unitPrice * item.product.quantity).toLocaleString('vi-VN')} đ</span>
                                                </div>
                                            </div>
                                        ))}
                                        {listCombosSelectInCart && listCombosSelectInCart.length > 0 && listCombosSelectInCart.map((item, index) => (
                                            <div className="order-detail-product-item" key={index}>
                                                <div className="product-item-infor">
                                                    <div className="product-item-image">
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${item.combo.image}`} alt="" />
                                                    </div>
                                                    <div className="product-item-infor">
                                                        <p className="infor-name">{item.combo.comboName} {item.combo.dataDrink.productName} ({item.combo.size})</p>
                                                        <div className="infor-price-quantity">
                                                            <p className="infor-price">
                                                                {Number(item.combo.unitPrice).toLocaleString('vi-VN')} đ
                                                            </p>
                                                            <p className="px-2">x</p>
                                                            <p className="infor-quantity">{item.combo.quantity}</p>
                                                        </div>
                                                        <p className="infor-store">Cửa hàng: {item.combo.dataStore.storeName}</p>
                                                    </div>
                                                </div>
                                                <div className="product-item-totalprice">
                                                    <span>{Number(item.combo.unitPrice * item.combo.quantity).toLocaleString('vi-VN')} đ</span>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    isBuyNow === true && isBuyNowCombo === false ? ( // Mua ngay trong PRODUCT
                                        <div className="order-detail-product-item">
                                            <div className="product-item-infor">
                                                <div className="product-item-image">
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${productDetailBuyNow?.product?.image}`} alt="Ảnh sản phẩm" />
                                                </div>
                                                <div className="product-item-infor">
                                                    <p className="infor-name">{productDetailBuyNow?.product?.productName} ({productDetailBuyNow?.size})</p>
                                                    <div className="infor-price-quantity">
                                                        <p className="infor-price">
                                                            {Number(productDetailBuyNow?.finalPrice).toLocaleString('vi-VN')} đ
                                                        </p>
                                                        <p className="px-2">x</p>
                                                        <p className="infor-quantity">{productDetailBuyNow?.quantity}</p>
                                                    </div>
                                                    <p className="infor-store">Cửa hàng: {productDetailBuyNow?.store?.storeName}</p>
                                                </div>
                                            </div>
                                            <div className="product-item-totalprice">
                                                <span>{Number(productDetailBuyNow?.finalPrice * productDetailBuyNow?.quantity).toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        </div>
                                    ) : ( // Mua ngay trong COMBO
                                        <div className="order-detail-product-item">
                                            <div className="product-item-infor">
                                                <div className="product-item-image">
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${comboDetailBuyNow?.combo?.image}`} alt="" />
                                                </div>
                                                <div className="product-item-infor">
                                                    <p className="infor-name">{comboDetailBuyNow?.combo?.comboName} + {comboDetailBuyNow?.drink?.productName} ({comboDetailBuyNow?.size})</p>
                                                    <div className="infor-price-quantity">
                                                        <p className="infor-price">
                                                            {Number(comboDetailBuyNow?.unitPrice).toLocaleString('vi-VN')} đ
                                                        </p>
                                                        <p className="px-2">x</p>
                                                        <p className="infor-quantity">{comboDetailBuyNow?.quantity}</p>
                                                    </div>
                                                    <p className="infor-store">Cửa hàng: {comboDetailBuyNow?.store?.storeName}</p>
                                                </div>
                                            </div>
                                            <div className="product-item-totalprice">
                                                <span>{Number(comboDetailBuyNow?.unitPrice * comboDetailBuyNow?.quantity).toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        </div>
                        <div className="order-totalprice">
                            <span>Tổng cộng </span>
                            <span>
                                {
                                    (isBuyNow === false && isBuyNowCombo === false)
                                        ? Number(getTotalPriceInCart()).toLocaleString('vi-VN')
                                        : (isBuyNow === false && isBuyNowCombo === true)
                                            ? Number(comboDetailBuyNow?.unitPrice * comboDetailBuyNow?.quantity).toLocaleString('vi-VN')
                                            : (isBuyNow === true && isBuyNowCombo === false)
                                                ? Number(productDetailBuyNow?.finalPrice * productDetailBuyNow?.quantity).toLocaleString('vi-VN')
                                                : null
                                } đ
                            </span>
                        </div>

                        <div className="shipping-method">
                            <h3>Phương thức thanh toán</h3>
                            <div className="payment-cash">
                                <input
                                    type="radio"
                                    id="cash"
                                    name="paymentMethod"
                                    value="Thanh toán khi nhận hàng"
                                    checked={paymentMethod === "Thanh toán khi nhận hàng"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="cash">
                                    <img src={iconCash} alt="" />Thanh toán khi nhận hàng
                                </label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="zalopay"
                                    name="paymentMethod"
                                    value="Zalopay"
                                    checked={paymentMethod === "Zalopay"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="zalopay">
                                    <img src={iconZalopay} alt="" />Zalopay
                                </label>
                            </div>
                            {/* <div>
                                <input
                                    type="radio"
                                    id="momo"
                                    name="paymentMethod"
                                    value="Momo"
                                    checked={paymentMethod === "Momo"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="momo">Momo</label>
                            </div> */}
                        </div>
                        <div className="voucher-container">
                            <h3>Chọn voucher</h3>
                            <Form.Select
                                className="voucher-select"
                                value={selectedVoucherId}
                                onChange={(e) => {
                                    setSelectedVoucherId(e.target.value);
                                    const voucher = filteredVouchers.find(voucher => +voucher.voucherId === +e.target.value);
                                    if (voucher) {
                                        setSelectedVoucher(voucher);
                                        setPromotion(+voucher.discountPercent);
                                    } else { // Không chọn mã
                                        setSelectedVoucher(null);
                                        setPromotion(0);
                                    }
                                }}
                            >
                                <option value="0">Không áp dụng</option>
                                {
                                    filteredVouchers && filteredVouchers.length > 0 && filteredVouchers.map((voucher, index) => (
                                        <option key={index} value={voucher.voucherId}>
                                            {voucher.code} ({Number(voucher.discountPercent)}%)
                                        </option>
                                    ))
                                }
                            </Form.Select>
                        </div>
                        <div className="shipping-fee-container">
                            <h3>Phí giao hàng</h3>
                            <div className="distance-container">
                                <span>Khoảng cách: </span>
                                <span>{distance} (km)</span>
                            </div>
                            <div className="fee-container">
                                <span>Chi phí giao hàng: </span>
                                <span>{Number(shippingFee).toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="promotion-container">
                                <span>Giảm giá: </span>
                                <span>{Number(promotion)}%</span>
                            </div>
                        </div>
                        <hr />
                        <div className="order-item">

                            <span>Tổng đơn hàng</span>
                            <span>
                                {
                                    isBuyNow === true && isBuyNowCombo === false
                                        ? Number(((productDetailBuyNow?.finalPrice * productDetailBuyNow?.quantity) * ((100 - promotion) / 100)) + shippingFee).toLocaleString('vi-VN')
                                        : isBuyNow === false && isBuyNowCombo === true
                                            ? Number(((comboDetailBuyNow?.unitPrice * comboDetailBuyNow?.quantity) * ((100 - promotion) / 100)) + shippingFee).toLocaleString('vi-VN')
                                            : Number(((getTotalPriceInCart()) * ((100 - promotion) / 100)) + shippingFee).toLocaleString('vi-VN')
                                } đ
                            </span>
                        </div>
                        <button className="place-order-btn" onClick={handlePlaceOrder}>
                            ĐẶT HÀNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout_V2;
