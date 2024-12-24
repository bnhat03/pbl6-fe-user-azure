// import React, { useEffect } from 'react';

// const RouteMap2 = () => {
//   useEffect(() => {
//     const lat = 18.297232;
//     const lon = 105.924872;
    
//     // Tạo URL của Nominatim API
//     const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

//     // Gọi API và xử lý kết quả
//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data && data.address) {
//           const address = data.address;
//           console.log('Địa chỉ:', address); // In ra địa chỉ trong console
//         } else {
//           console.log('Không tìm thấy địa chỉ');
//         }
//       })
//       .catch((error) => {
//         console.error('Lỗi khi gọi API:', error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Geocoding (chỉ in kết quả ra console)</h2>
//     </div>
//   );
// };

// export default RouteMap2;

import React, { useEffect, useState } from 'react';
import polyline from 'polyline';
import axios from "axios";
const RouteMap2 =  () => {
  const [route, setRoute] = useState(null);
  const [motorcycleDuration, setMotorcycleDuration] = useState(null);
  const decodePolyline = (encoded) => { // encoded: Chuỗi mã hóa
    const decodedCoords = polyline.decode(encoded);
    // Chuyển đổi [lng, lat] sang [lat, lng]
    return decodedCoords.map(coord => ({ lat: coord[0], lng: coord[1] }));
  };
  useEffect(async () => {
    // Tọa độ của 2 điểm (Điểm xuất phát và điểm đích)
    const coordinates = [
      { lat: 16.069908, lon: 108.151274 }, // Tọa độ của Hà Nội
      { lat: 16.0800328, lon: 108.147122 }, // Tọa độ của Vĩnh Yên
    ];

    const url = `http://router.project-osrm.org/route/v1/driving/${coordinates[0].lon},${coordinates[0].lat};${coordinates[1].lon},${coordinates[1].lat}?overview=full&steps=true`;
    try {
      // Gửi yêu cầu API bằng axios
      const response = await axios.get(url);

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const routeData = response.data.routes[0]; // Lấy kết quả lộ trình đầu tiên
        setRoute(routeData);

        // Lấy thời gian duration (tính bằng giây)
        const durationInSeconds = routeData.duration;

        // Giả sử tốc độ trung bình của xe máy là 40 km/h (11.1 m/s)
        const motorcycleSpeedInMetersPerSecond = 11.1;

        // Tính toán lại duration cho xe máy
        const distanceInMeters = routeData.distance; // Đoạn đường dài tính bằng mét
        const motorcycleDurationInSeconds = distanceInMeters / motorcycleSpeedInMetersPerSecond;

        console.log("Đường đi:", routeData.geometry); // In thông tin lộ trình ra console
        const decodedPath = decodePolyline(routeData.geometry);
        console.log(">>> geometry -> route?: ", decodedPath); // Array các điểm -> Nối lại có đường đi với mỗi điểm: [lat, lng]

        setMotorcycleDuration(motorcycleDurationInSeconds);
      } else {
        console.log("Không tìm thấy đường đi");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  }, []);

  return (
    <div>
    <h2>Thông tin đường đi giữa 2 địa điểm</h2>
    {route && (
      <div>
        <h3>Distance: {route.distance} meters</h3>
        <h3>Duration for Car (driving): {route.duration} seconds</h3>
        <h3>Duration for Motorcycle: {motorcycleDuration} seconds</h3>
        <h3>Bước đi:</h3>
        <ul>
          {route.legs[0].steps.map((step, index) => (
            <li key={index}>{step.maneuver.instruction}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
  );
};

export default RouteMap2;
