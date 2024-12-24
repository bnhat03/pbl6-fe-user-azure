import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
    const [addressCoords, setAddressCoords] = useState([16.075966, 108.149805]);
    const [clickedCoords, setClickedCoords] = useState(null); // Thêm state lưu tọa độ click

    return (
        <MapContainer
            center={[16.2554, 107.9006]}
            zoom={12}
            style={{ height: '800px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {addressCoords && (
                <Marker position={addressCoords}>
                    <Popup>
                        Tọa độ của địa chỉ: {addressCoords.join(", ")}
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
        </MapContainer>
    );
};

export default RouteMap;
