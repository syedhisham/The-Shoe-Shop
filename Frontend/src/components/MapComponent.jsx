import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

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
  const [zoomLevel, setZoomLevel] = useState(15); 

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">

      <MapContainer
        center={position}
        zoom={zoomLevel}
        scrollWheelZoom={true} 
        className="w-full h-full transition-transform duration-300 ease-in-out"
        onZoomEnd={(e) => setZoomLevel(e.target.getZoom())} 
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup className="custom-popup bg-white p-2 rounded-md shadow-lg">
            <div style={{ textAlign: "center" }}>
              <h3 className="text-lg font-semibold">Our Location</h3>
              <p className="text-sm">Come visit us for great products!</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-md z-20">
        <FaMapMarkerAlt className="text-gray-800" size={24} />
      </div>
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-md z-20">
        <button className="text-gray-700 hover:text-gray-900">
          Zoom In
        </button>
      </div>
      <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-md z-20">
        <button className="text-gray-700 hover:text-gray-900">
          Zoom Out
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
