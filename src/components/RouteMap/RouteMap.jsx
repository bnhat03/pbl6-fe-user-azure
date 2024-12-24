import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'; import 'leaflet/dist/leaflet.css';
import polyline from 'polyline';
import './RouteMap.scss'

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]); // Cập nhật vị trí với tọa độ đã click
    },
  });

  return null;
};


const RouteMap = () => {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [addressCoords, setAddressCoords] = useState([16.075966, 108.149805]); // Tọa độ hiện tại của mình
  const [clickedCoords, setClickedCoords] = useState(null); // Thêm state lưu tọa độ click
  const apiKey = import.meta.env.VITE_API_KEY_MAP;

  // geometry -> 2 điểm 
  const decodePolyline = (encoded) => {
    const decodedCoords = polyline.decode(encoded);
    // Chuyển đổi [lng, lat] sang [lat, lng]
    return decodedCoords.map(coord => ({ lat: coord[0], lng: coord[1] }));
  };

  // const fetchRoute = async () => {
  //   const start = [108.2207, 16.0471]; // Đà Nẵng
  //   const end = [107.5804, 16.4637];   // Huế
  //   try {
  //     const response = await axios.post(
  //       `https://api.openrouteservice.org/v2/directions/driving-car`,
  //       {
  //         coordinates: [start, end],
  //         format: 'geojson',
  //       },
  //       {
  //         headers: {
  //           Authorization: apiKey,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     if (
  //       response.data &&
  //       response.data.routes &&
  //       response.data.routes[0]?.segments &&
  //       response.data.routes[0].segments[0]?.distance &&
  //       response.data.routes[0].geometry
  //     ) {
  //       const routeDistance = response.data.routes[0].segments[0].distance;
  //       setDistance((routeDistance / 1000).toFixed(2)); // Convert to km and format
  //       // Get route geometry (assuming it's a polyline string)
  //       // const geometry = response.data.routes[0].geometry;
  //       // Convert geometry -> [lng, lat] to [lat, lng]
  //       const decodedPath = decodePolyline(response.data.routes[0].geometry);
  //       // console.log('>>> geometry: ', decodedPath);
  //       setRoute(decodedPath);
  //       setError(null);
  //     } else {
  //       setError("Unexpected API response format");
  //     }
  //   } catch (err) {
  //     setError("Unable to fetch route: " + err.message);
  //     console.error(err);
  //   }
  // };
  const fetchRoute = async () => {
    const start = [108.2207, 16.0471]; // Đà Nẵng
    const end = [107.5804, 16.4637];   // Huế
    const url = `http://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&steps=true`;
    try {
      const response = await axios.get(url);
      if (
        response.data && response.data.routes && response.data.routes.length > 0
      ) {
        const routeData = response.data.routes[0];
        const routeDistance = routeData.distance;
        setDistance((routeDistance / 1000).toFixed(2)); // Convert to km and format
        const decodedPath = decodePolyline(routeData.geometry);
        setRoute(decodedPath);
        setError(null);
      } else {
        setError("Unexpected API response format");
      }
    } catch (err) {
      setError("Unable to fetch route: " + err.message);
      console.error(err);
    }
  };

  // Hàm lấy tọa độ từ địa chỉ
  const fetchCoordinatesFromAddress = async (address) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/search`,
        {
          params: {
            text: address,
          },
          headers: {
            Authorization: apiKey,
          },
        }
      );

      // console.log('>>> Geocoding response: ', response);

      if (response.data && response.data.features.length > 0) {
        const coords = response.data.features[0].geometry.coordinates;
        const latLng = [coords[1], coords[0]]; // Đổi sang định dạng [lat, lng]
        setAddressCoords(latLng);
        setError(null);
      } else {
        setError("No coordinates found for this address");
      }
    } catch (err) {
      setError("Unable to fetch coordinates: " + err.message);
      console.error(err);
    }
  };

  // Hàm lấy địa chỉ từ tọa độ
  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse?point.lon=${longitude}&point.lat=${latitude}&size=1`,
        {
          // params: {
          //   point: `${longitude},${latitude}`, // Sử dụng chuỗi `${longitude},${latitude}`
          //   size: 1,
          // },
          headers: {
            Authorization: apiKey,
          },
        }
      );

      // console.log('>>> Reverse Geocoding response: ', response);

      if (response.data && response.data.features.length > 0) {
        const address = response.data.features[0].properties.label; // Địa chỉ đầy đủ
        // setAddress(address);
        alert(address);
        setError(null);
      } else {
        setError("No address found for these coordinates");
      }
    } catch (err) {
      console.error("Error details: ", err); // Ghi log chi tiết lỗi
      setError("Unable to fetch address: " + (err.response ? err.response.data.message : err.message));
    }
  };


  // Component để phóng to bản đồ
  const ZoomToAddress = () => {
    const map = useMap();

    if (addressCoords) {
      map.setView(addressCoords, 18); // Phóng to đến tọa độ với level 18
    }
    return null;
  };

  // Hàm xử lý click trên bản đồ
  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setClickedCoords([lat, lng]); // Lưu tọa độ đã click
    // console.log("Clicked coordinates:", [lat, lng]); // Thêm log để kiểm tra tọa độ đã click
  };

  return (
    <div>
      <button onClick={fetchRoute}>Tính toán lộ trình từ Đà Nẵng đến Hà Tĩnh</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {distance && (
        <p>Khoảng cách từ Đà Nẵng đến Hà Tĩnh: {distance} km</p> // Display distance in km
      )}

      <button onClick={() => fetchCoordinatesFromAddress('Hà Tĩnh')} className='btn-get-coordinate'>Lấy tọa độ Hà Tĩnh</button>
      <button onClick={() => fetchAddressFromCoordinates(16.075966, 108.149805)} className='btn-get-address'>Lấy địa chỉ từ tọa độ (hiện tại - trọ)</button>

      <button
        onClick={() => {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                // console.log("Latitude:", latitude);
                // console.log("Longitude:", longitude);

                const latLng = [latitude, longitude];
                setAddressCoords(latLng);
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
        }}
        className='btn-get-coordinate'>
        Lấy tọa độ hiện tại
      </button>


      <MapContainer
        center={[16.2554, 107.9006]}
        zoom={9}
        style={{ height: '500px', width: '100%' }}
        onClick={handleMapClick} //
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {route && (
          <Polyline positions={route} color="blue" />
        )}
        {addressCoords && (
          <Marker position={addressCoords}>
            <Popup>
              Tọa độ của địa chỉ. {addressCoords}
            </Popup>
          </Marker>
        )}
        {clickedCoords && (
          <Marker position={clickedCoords}>
            <Popup>
              Tọa độ đã click: {clickedCoords.join(", ")}
            </Popup>
          </Marker>
        )}
        <LocationMarker setPosition={setClickedCoords} /> {/* Cập nhật vị trí đã click */}
        <ZoomToAddress /> {/* Thêm component phóng to */}
      </MapContainer>
    </div>
  );
};

export default RouteMap;


