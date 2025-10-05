import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  lat: number;
  lon: number;
  onLocationChange: (lat: number, lon: number) => void;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }: { 
  position: LatLngExpression; 
  setPosition: (pos: LatLngExpression) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return <Marker position={position} />;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  lat,
  lon,
  onLocationChange
}) => {
  const [position, setPosition] = useState<LatLngExpression>([lat, lon]);

  const handlePositionChange = (newPosition: LatLngExpression) => {
    setPosition(newPosition);
    const [newLat, newLon] = newPosition as [number, number];
    onLocationChange(newLat, newLon);
  };

  const handleInputChange = (field: 'lat' | 'lon', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const [currentLat, currentLon] = position as [number, number];
      if (field === 'lat') {
        handlePositionChange([numValue, currentLon]);
      } else {
        handlePositionChange([currentLat, numValue]);
      }
    }
  };

  const [currentLat, currentLon] = position as [number, number];

  return (
    <div className="location-picker">
      <h3 className="location-title">📍 Selecione a Localização</h3>
      <p className="location-instruction">
        Clique no mapa para escolher a localização ou digite as coordenadas manualmente
      </p>
      
      <div className="coordinates-input">
        <div className="input-field">
          <label htmlFor="latitude">Latitude:</label>
          <input
            id="latitude"
            type="number"
            step="0.001"
            value={currentLat.toFixed(6)}
            onChange={(e) => handleInputChange('lat', e.target.value)}
            placeholder="-9.665"
          />
        </div>
        <div className="input-field">
          <label htmlFor="longitude">Longitude:</label>
          <input
            id="longitude"
            type="number"
            step="0.001"
            value={currentLon.toFixed(6)}
            onChange={(e) => handleInputChange('lon', e.target.value)}
            placeholder="-35.735"
          />
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={position}
          zoom={10}
          style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={handlePositionChange} />
        </MapContainer>
      </div>

      <div className="location-info">
        <p>
          <strong>Localização atual:</strong> {currentLat.toFixed(4)}°, {currentLon.toFixed(4)}°
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
