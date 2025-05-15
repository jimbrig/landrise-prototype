import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Property } from '../../types';
import { formatCurrency, formatAcres } from '../../utils/formatters';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Custom marker icons
const createMarkerIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-8 h-8 rounded-full flex items-center justify-center ${
      isSelected 
        ? 'bg-blue-500 text-white shadow-lg scale-125' 
        : 'bg-green-500 text-white'
    } transform transition-transform hover:scale-110">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelectProperty?: (property: Property) => void;
  height?: string;
  isLoading?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  height = '500px',
  isLoading = false
}) => {
  const navigate = useNavigate();

  const getMapBounds = () => {
    if (properties.length === 0) {
      return [[30.2672, -97.7431], [30.2672, -97.7431]]; // Default to Austin
    }
    const lats = properties.map(p => p.latitude);
    const lngs = properties.map(p => p.longitude);
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ];
  };

  const handleViewDetails = (e: React.MouseEvent, property: Property) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/parcel/${property.id}`);
  };

  if (isLoading) {
    return (
      <div 
        style={{ height }} 
        className="rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 bg-gray-50 flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 relative">
      <MapContainer
        bounds={getMapBounds() as L.LatLngBoundsExpression}
        style={{ height: '100%', width: '100%' }}
        zoom={12}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createMarkerIcon(selectedProperty?.id === property.id)}
            eventHandlers={{
              click: () => onSelectProperty?.(property)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <img 
                  src={property.images[0]} 
                  alt={property.address}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold mb-1">{property.address}</h3>
                <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  {formatCurrency(property.price)}
                </p>
                <p className="text-sm text-gray-600">{formatAcres(property.acres)}</p>
                <button
                  onClick={(e) => handleViewDetails(e, property)}
                  className="mt-2 w-full px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapController 
          properties={properties} 
          selectedProperty={selectedProperty}
        />
      </MapContainer>
      
      {/* Property Count Overlay */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md z-[1000]">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
        </span>
      </div>
    </div>
  );
};

interface MapControllerProps {
  properties: Property[];
  selectedProperty?: Property;
}

const MapController: React.FC<MapControllerProps> = ({ 
  properties, 
  selectedProperty 
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.setView(
        [selectedProperty.latitude, selectedProperty.longitude],
        14
      );
    } else if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, properties, selectedProperty]);

  return null;
};

export default MapView;