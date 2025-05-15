import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Property } from '../../types';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelectProperty?: (property: Property) => void;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  height = '500px'
}) => {
  const getMapBounds = () => {
    if (properties.length === 0) {
      return [[39.8283, -98.5795], [39.8283, -98.5795]]; // Center of US
    }
    const lats = properties.map(p => p.latitude);
    const lngs = properties.map(p => p.longitude);
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <MapContainer
        bounds={getMapBounds() as L.LatLngBoundsExpression}
        style={{ height: '100%', width: '100%' }}
        zoom={4}
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
            eventHandlers={{
              click: () => onSelectProperty?.(property)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold mb-1">{property.address}</h3>
                <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  {formatPrice(property.price)}
                </p>
                <p className="text-sm text-gray-600">{property.acres} acres</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapController 
          properties={properties} 
          selectedProperty={selectedProperty}
        />
      </MapContainer>
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