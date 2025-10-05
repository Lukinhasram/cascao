import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
import icon from '../assets/pin.png';
// import iconShadow from '../assets/pin_shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  // shadowUrl: iconShadow,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  shadowSize: [40, 40],
  shadowAnchor: [12, 40]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  lat: number;
  lon: number;
  onLocationChange: (lat: number, lon: number) => void;
}

// Component to handle map view updates
function MapViewController({ center }: { center: LatLngExpression }) {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
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
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handlePositionChange = (newPosition: LatLngExpression) => {
    setPosition(newPosition);
    const [newLat, newLon] = newPosition as [number, number];
    onLocationChange(newLat, newLon);
  };

  const searchAddress = async () => {
    if (!address.trim()) {
      setSearchError('Please enter an address');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'Climate Analysis App' // Required by Nominatim
          }
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat: newLat, lon: newLon } = data[0];
        handlePositionChange([parseFloat(newLat), parseFloat(newLon)]);
        setSearchError('');
      } else {
        setSearchError('Address not found. Try another address or city.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchError('Error searching address. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  const [currentLat, currentLon] = position as [number, number];

  return (
    <div className="location-picker">
      <h3 className="location-title">Select Location</h3>
      
      {/* Address Search Section */}
      <div className="address-search">
        <label htmlFor="address-input">Search by address:</label>
        <div className="search-input-group">
          <input
            id="address-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a city, street or address..."
            disabled={isSearching}
          />
          <button 
            onClick={searchAddress} 
            disabled={isSearching}
            className="search-button"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchError && <p className="search-error">{searchError}</p>}
      </div>

      <p className="location-instruction">
        Or click on the map to choose the location
      </p>
      
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
          <MapViewController center={position} />
          <LocationMarker position={position} setPosition={handlePositionChange} />
        </MapContainer>
      </div>

      <div className="location-info">
        <p>
          <strong>Coordinates:</strong> {currentLat.toFixed(4)}°, {currentLon.toFixed(4)}°
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
