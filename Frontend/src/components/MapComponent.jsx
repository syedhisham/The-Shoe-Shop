import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { FaMapMarkerAlt } from "react-icons/fa";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const latitude = parseFloat(import.meta.env.VITE_MY_LOCATION_LATITUDE);
const longitude = parseFloat(import.meta.env.VITE_MY_LOCATION_LONGITUDE);

const MapComponent = () => {
  const position = [latitude, longitude];

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <strong>Our Location</strong>
            <br />
            This is where you can find us!
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-20">
        <FaMapMarkerAlt className="text-gray-800" size={24} />
      </div>
    </div>
  );
};

export default MapComponent;
