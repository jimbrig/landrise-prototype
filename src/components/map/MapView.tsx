import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../../types';

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelectProperty?: (property: Property) => void;
  height?: string;
}

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  height = '500px'
}) => {
  const getBounds = () => {
    if (properties.length === 0) {
      return [[39.8283, -98.5795]]; // Center of US
    }
    return properties.map(prop => [prop.latitude, prop.longitude]);
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        bounds={getBounds() as L.LatLngBoundsExpression}
        style={{ height: '100%', width: '100%' }}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            eventHandlers={{
              click: () => onSelectProperty && onSelectProperty(property)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{property.address}</h3>
                <p className="text-sm text-gray-600">{property.acres} acres</p>
                <p className="text-sm font-semibold text-green-600">
                  ${property.price.toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapController properties={properties} selectedProperty={selectedProperty} />
      </MapContainer>
    </div>
  );
};

interface MapControllerProps {
  properties: Property[];
  selectedProperty?: Property;
}

const MapController: React.FC<MapControllerProps> = ({ properties, selectedProperty }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.setView(
        [selectedProperty.latitude, selectedProperty.longitude],
        14
      );
    } else if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds);
    }
  }, [map, properties, selectedProperty]);

  return null;
};

export default MapView;