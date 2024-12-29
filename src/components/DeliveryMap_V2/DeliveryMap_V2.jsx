import React, { useState, useEffect, useCallback } from 'react'
import './DeliveryMap.scss'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreById } from "../../redux/actions/storeActions";
import { fetchProductsByIdStore } from '../../redux/actions/productActions';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from 'polyline';
import { toast } from 'react-toastify';
import logoUser from '../../assets/logo/user.png'
import L from 'leaflet';  // Customize icon
import iconUser from '../../assets/logo/map_user.png'
import iconShipper from '../../assets/logo/map_shipper.png'
import { fetchOrderInTransitByOrderCode } from '../../redux/actions/userActions';
import { Modal } from 'react-bootstrap';
import { debounce } from 'lodash';

// Click trên map
const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]); 
    },
  });
  return null;
};

const DeliveryMap_V2 = () => {
  const { orderCode } = useParams();
  const dispatch = useDispatch();
  const orderInTransit = useSelector((state) => {
    return state.user.orderInTransit;
  })
  const [showModal, setShowModal] = useState(false); // Hiển thị preview ảnh
  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();  
    const month = date.getMonth() + 1;  
    const year = date.getFullYear();  
    const hours = date.getHours().toString().padStart(2, '0');  
    const minutes = date.getMinutes().toString().padStart(2, '0');  
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
  };

  const [orderCoords, setOrderCoords] = useState([107.9006, 16.2554]); // [lon, lat]: Tọa độ nhận hàng
  const [shipperCoords, setShipperCoords] = useState(null); // Tọa độ hiện tại của Shipper
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchOrderInTransitByOrderCode(orderCode));
  }, [orderCode]);

  useEffect(() => {
    if (orderInTransit && orderInTransit.shipperDetail) { // Có shipper nhận hàng
      const newOrderCoords = [orderInTransit.longitude, orderInTransit.latitude];
      const newShipperCoords = [orderInTransit.shipperDetail.longitude, orderInTransit.shipperDetail.latitude];
      setOrderCoords(newOrderCoords);
      setShipperCoords(newShipperCoords);
    }
  }, [orderInTransit]);

  const debouncedFetchRoute = useCallback(
    debounce(() => {
      fetchRoute();
    }, 1000), 
    []
  );
  useEffect(() => {
    if (orderCoords && shipperCoords) {
      fetchRoute();
      // debouncedFetchRoute();
    }
  }, [orderCoords, shipperCoords]); 

  // Map
  const [route, setRoute] = useState(null); // Đường đi trên map
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null); 
  const [addressCoords, setAddressCoords] = useState([16.075966, 108.149805]); // Tọa độ hiện tại của mình (Mới vô) / Tọa độ Click
  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setAddressCoords([lat, lng]); 
  };
  const ZoomToAddress = ({ addressCoords }) => {
    const map = useMap();
    useEffect(() => {
      if (addressCoords) {
        map.setView(addressCoords, 13); 
      }
    }, [addressCoords, map]);
    return null;
  };
  // Đường đi trên map
  const fetchRoute = async () => {
    if (!orderCoords || !shipperCoords || orderCoords.length < 2 || shipperCoords.length < 2) {
      toast.warn('Chưa có đủ thông tin tọa độ để tìm đường.');
      return;
    }
    const url = `https://router.project-osrm.org/route/v1/driving/${orderCoords[0]},${orderCoords[1]};${shipperCoords[0]},${shipperCoords[1]}?overview=full&steps=true`; // [long, lat]
    const response = await axios.get(url);
    try {
      if (
        response.data && response.data.routes && response.data.routes.length > 0
      ) {
        const routeData = response.data.routes[0];
        const routeDistance = routeData.distance; // mét
        const routeDuration = routeData.duration; // giây
        setDistance((routeDistance / 1000).toFixed(2)); // m -> km
        setDuration((routeDuration / 60).toFixed(2));   // s -> m
        const decodedPath = decodePolyline(routeData.geometry); 
        setRoute(decodedPath); // Đường đi
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi khi tìm đường đi');
    }
  };
  // geometry -> Array các tọa độ, mỗi tọa độ là object chứa 2 key: lat, lng
  const decodePolyline = (encoded) => { 
    const decodedCoords = polyline.decode(encoded);
    return decodedCoords.map(coord => ({ lat: coord[0], lng: coord[1] }));
  };

  // Customize icon markup
  const customIconUser = new L.Icon({
    iconUrl: iconUser,
    iconSize: [40, 40],       
    iconAnchor: [20, 40],    
    popupAnchor: [0, -40],    
  });
  const customIconShipper = new L.Icon({
    iconUrl: iconShipper,
    iconSize: [40, 40],       
    iconAnchor: [20, 40],    
    popupAnchor: [0, -40],    
  });

  if (!orderInTransit) {
    return <div>Không có thông tin đơn hàng.</div>;
  }
  else return (
    <div className="page-store-detail">
      <div className="container">
        <div className="store-detail-infor">
          <div className="infor-left">
            <div className="infor-left-order-container">
              <div className="title">ĐƠN HÀNG</div>
              <div className="order-detail-container">
                <span className="">
                  <i className="fa-solid fa-fingerprint"></i>
                  Mã đơn hàng: {orderInTransit.orderCode}
                </span>
                <span className="">
                  <i className="fa-solid fa-calendar-days"></i>
                  Ngày đặt: {formatDate(orderInTransit.createdAt)}
                </span>
                <span className="">
                  <i className="fa-solid fa-location-dot"></i>
                  Địa chỉ nhận hàng: {orderInTransit.deliveryAddress}
                </span>
                <span className="">
                  <i className="fa-solid fa-money-bill-wave"></i>
                  Tổng tiền: {Number(orderInTransit.totalAmount).toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
            <div className="infor-left-shipper-container">
              <div className="title">Shipper</div>
              <div className="shipper-detail-container">
                {
                  +orderInTransit.shipperId === 0 ? (
                    <div className='no-shipper'>Hiện tại chưa có shipper nào nhận đơn!</div>
                  ) : (
                    <div className="has-shipper">
                      <span className="avatar">
                        <i className="fa-solid fa-user-astronaut"></i>
                        Ảnh đại diện:
                        <img
                          src={orderInTransit?.shipperDetail?.avatar
                            ? `data:image/png;base64,${orderInTransit.shipperDetail.avatar}`
                            : logoUser
                          }
                          onClick={() => setShowModal(true)}
                          alt="Avatar của shipper"
                        />
                      </span>
                      <span className="">
                        <i className="fa-solid fa-file-signature"></i>
                        Họ tên: {orderInTransit?.shipperDetail?.fullName ? orderInTransit.shipperDetail.fullName : ''}
                      </span>
                      <span className="">
                        <i className="fa-solid fa-phone-volume"></i>
                        Số điện thoại: {orderInTransit?.shipperDetail?.phoneNumber ? orderInTransit.shipperDetail.phoneNumber : ''}
                      </span>
                      {/* <span className="">
                        <i className="fa-solid fa-list-ol"></i>
                        Biển số xe: 38X1-21129
                      </span> */}
                    </div>
                  )
                }

              </div>
            </div>
          </div>
          <div className="infor-right">
            <div className="infor-right-ggmap-container">
              <MapContainer
                center={[orderCoords[1], orderCoords[0]]} // [lat, lon]
                zoom={15}
                style={{ height: '80vh', width: '100%' }}
                onClick={handleMapClick} //
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Render tuyến đường giữa các điểm */}
                {route && (
                  <Polyline positions={route} color="blue">
                    <Tooltip permanent direction="center">
                      {`Khoảng cách: ${distance} km - Thời gian: ${duration} phút`}
                    </Tooltip>
                  </Polyline>
                )}
                {/*Vị trí nhận hàng */}
                {orderCoords && orderCoords[0] && orderCoords[1] && (
                  <Marker position={[orderCoords[1], orderCoords[0]]} icon={customIconUser}> {/* Đảo vị trí lat-lon để phù hợp với Leaflet */}
                    <Popup>Địa điểm nhận hàng</Popup>
                  </Marker>
                )}

                {/* Vị trí của shipper */}
                {shipperCoords && shipperCoords[0] && shipperCoords[1] && (
                  <Marker position={[shipperCoords[1], shipperCoords[0]]} icon={customIconShipper}>
                    <Popup>Vị trí của shipper</Popup>
                  </Marker>
                )}
                <LocationMarker setPosition={setAddressCoords} /> {/* Cập nhật vị trí đã click */}
                <ZoomToAddress addressCoords={addressCoords} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Modal preview */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <img
            src={orderInTransit?.shipperDetail?.avatar
              ? `data:image/png;base64,${orderInTransit.shipperDetail.avatar}`
              : logoUser
            }
            alt="Avatar của shipper"
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}
export default DeliveryMap_V2
