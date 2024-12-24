import React, { useState, useEffect } from 'react'
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

import L from 'leaflet';  // Import Leaflet to customize icon
// import logoUser from '../../assets/logo/user.png'
import iconUser from '../../assets/logo/map_user.png'
import iconShipper from '../../assets/logo/map_shipper.png'
import { fetchOrderInTransitByOrderCode } from '../../redux/actions/userActions';
import { Modal } from 'react-bootstrap';

// Component Click chuột trên map
const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]); // Cập nhật vị trí với tọa độ đã click
      // console.log('>>> longitude 2: ', lng);
      // console.log('>>> latitude 2: ', lat);
    },
  });
  return null;
};


const DeliveryMap = () => {
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
    const day = date.getDate();  // Lấy ngày
    const month = date.getMonth() + 1;  // Lấy tháng (tháng trong JS bắt đầu từ 0)
    const year = date.getFullYear();  // Lấy năm
    const hours = date.getHours().toString().padStart(2, '0');  // Lấy giờ (padStart để đảm bảo đủ 2 chữ số)
    const minutes = date.getMinutes().toString().padStart(2, '0');  // Lấy phút
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
  };

  // useEffect(() => { // orderCode thay đổi -> fetch lại để view order đang giao (Tương tự chi tiết sản phẩm đã làm)
  //   console.log('orderCode: ', orderCode);
  //   dispatch(fetchOrderInTransitByOrderCode(orderCode));
  // }, [orderCode]);
  // useEffect(() => { // Tọa độ shipper thay đổi -> Vẽ lại map
  //   if (orderInTransit && orderInTransit.shipperDetail) { // Có shipper nhận hàng
  //     setOrderCoords([orderInTransit.longitude, orderInTransit.latitude]);
  //     setShipperCoords([orderInTransit.shipperDetail.longitude, orderInTransit.shipperDetail.latitude]);
  //     console.log('>>> orderCoords: ', orderCoords);
  //     console.log('>>> shipperCoords: ', shipperCoords);

  //     fetchRoute(); // Call API ORS hiển thị trên map: route + distance + duration

  //   }
  // }, [orderInTransit]);
  const [orderCoords, setOrderCoords] = useState([107.9006, 16.2554]); // [lon, lat]: Tọa độ nhận hàng
  const [shipperCoords, setShipperCoords] = useState(null); // Tọa độ hiện tại của Shipper
  useEffect(() => {
    // console.log('orderCode: ', orderCode);
    dispatch(fetchOrderInTransitByOrderCode(orderCode));
  }, [orderCode]);

  useEffect(() => {
    if (orderInTransit && orderInTransit.shipperDetail) { // Có shipper nhận hàng
      const newOrderCoords = [orderInTransit.longitude, orderInTransit.latitude];
      const newShipperCoords = [orderInTransit.shipperDetail.longitude, orderInTransit.shipperDetail.latitude];
      // console.log('newShipperCoords: ', newShipperCoords);
      setOrderCoords(newOrderCoords);
      setShipperCoords(newShipperCoords);
      // fetchRoute(); => Chưa cập nhật kịp
    }
  }, [orderInTransit]);

  // Gọi fetchRoute khi 2 State orderCoords và shipperCoords đã được cập nhật
  useEffect(() => {
    if (orderCoords && shipperCoords) {
      fetchRoute();
    }
  }, [orderCoords, shipperCoords]); // dependency = state ??? => Vẫn được

  // Map
  const [route, setRoute] = useState(null); // Đường đi trên map
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null); // Thời gian di chuyển ước lượng
  const [addressCoords, setAddressCoords] = useState([16.075966, 108.149805]); // Tọa độ hiện tại của mình (Mới vô) / Tọa độ Click
  const apiKey = import.meta.env.VITE_API_KEY_MAP;
  // const [orderCoords, setOrderCoords] = useState([108.149805, 16.075966]); // [lon, lat]: Tọa độ nhận hàng
  // const [shipperCoords, setShipperCoords] = useState([108.1497442227022, 16.073974660899232]); // Tọa độ hiện tại của Shipper


  // Lấy tọa độ hiện tại
  const getCurrentCoors = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const latLon = [latitude, longitude];
          setAddressCoords(latLon);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra cài đặt vị trí.");
        },
        {
          enableHighAccuracy: true,  // Yêu cầu độ chính xác cao
          timeout: 10000,            // Thời gian tối đa để lấy vị trí (ms)
          maximumAge: 0              // Luôn lấy vị trí mới nhất
        }
      );

    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Trình duyệt của bạn không hỗ trợ lấy vị trí.");
    }
  }
  // Hàm xử lý click trên bản đồ 
  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setAddressCoords([lat, lng]); // Lưu tọa độ đã click
  };

  // Component để phóng to bản đồ
  // const ZoomToAddress = () => {
  //   const map = useMap();
  //   if (addressCoords) {
  //     map.setView(addressCoords, 16); // Phóng to đến tọa độ với level 18
  //   }
  //   return null;
  // };
  const ZoomToAddress = ({ addressCoords }) => {
    const map = useMap();
    useEffect(() => {
      if (addressCoords) {
        map.setView(addressCoords, 13); // Phóng to đến tọa độ với level 16
      }
    }, [addressCoords, map]);
    return null;
  };


  // Tọa độ -> Địa chỉ
  // const fetchAddressFromCoordinates = async (latitude, longitude) => {
  //   try {
  //     const response = await axios.get(
  //       `https://api.openrouteservice.org/geocode/reverse?point.lon=${longitude}&point.lat=${latitude}&size=1`,
  //       {
  //         headers: {
  //           Authorization: apiKey,
  //         },
  //       }
  //     );
  //     if (response.data && response.data.features.length > 0) {
  //       const address = response.data.features[0].properties.label; // Địa chỉ đầy đủ
  //       setAddress(address);
  //     }
  //   } catch (err) {
  //     console.error("Error details: ", err);
  //   }
  // };

  // Đường đi trên map
  const fetchRoute = async () => {
    // Check if orderCoords and shipperCoords are valid coordinates
    if (!orderCoords || !shipperCoords || orderCoords.length < 2 || shipperCoords.length < 2) {
      toast.warn('Chưa có đủ thông tin tọa độ để tìm đường.');
      return;
    }
    // alert('hehe');
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          coordinates: [orderCoords, shipperCoords],
          format: 'geojson',
        },
        {
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      if (
        response.data &&
        response.data.routes &&
        response.data.routes[0]?.segments &&
        response.data.routes[0].segments[0]?.distance &&
        response.data.routes[0].segments[0]?.duration &&
        response.data.routes[0].geometry
      ) {
        const routeDistance = response.data.routes[0].segments[0].distance; // mét
        const routeDuration = response.data.routes[0].segments[0].duration; // giây
        setDistance((routeDistance / 1000).toFixed(2)); // m -> km
        setDuration((routeDuration / 60).toFixed(2));   // s -> m
        // console.log('>>> res 2 điểm trên map: ', response);
        console.log('>>> tọa độ nhận hàng: ', orderCoords);
        console.log('Số km: ', distance);
        const decodedPath = decodePolyline(response.data.routes[0].geometry);
        // console.log('>>> geometry -> route?: ', decodedPath); // Array các điểm -> Nối lại có đường đi với mỗi điểm: [lat, lng]
        setRoute(decodedPath); // Đường đi
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi khi tìm đường đi');
    }
  };
  // geometry -> 2 điểm 
  const decodePolyline = (encoded) => { // encoded: Chuỗi mã hóa
    const decodedCoords = polyline.decode(encoded);
    // Chuyển đổi [lng, lat] sang [lat, lng]
    return decodedCoords.map(coord => ({ lat: coord[0], lng: coord[1] }));
  };

  // Customize icon markup
  const customIconUser = new L.Icon({
    iconUrl: iconUser,
    iconSize: [40, 40],       // Kích thước icon
    iconAnchor: [20, 40],     // Điểm gắn icon
    popupAnchor: [0, -40],    // Điểm gắn Popup
  });
  const customIconShipper = new L.Icon({
    iconUrl: iconShipper,
    iconSize: [40, 40],       // Kích thước icon
    iconAnchor: [20, 40],     // Điểm gắn icon
    popupAnchor: [0, -40],    // Điểm gắn Popup
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
                      <span className="">
                        <i className="fa-solid fa-list-ol"></i>
                        Biển số xe: 38X1-21129
                      </span>
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
                {/*Địa chỉ người dùng đã click */}
                {/* {addressCoords && (
                  <Marker position={addressCoords}>
                    <Popup>
                      Tọa độ của địa chỉ: {addressCoords[0]}, {addressCoords[1]}
                    </Popup>
                  </Marker>
                )} */}
                <LocationMarker setPosition={setAddressCoords} /> {/* Cập nhật vị trí đã click */}
                <ZoomToAddress addressCoords={addressCoords} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for full-screen preview */}
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
export default DeliveryMap
