import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../../types';

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelectProperty?: (property: Property) => void;
  height?: string;
  regions?: GeoJSON.FeatureCollection;
  selectedRegion?: string;
}

const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  height = '500px',
  regions,
  selectedRegion
}) => {
  const getBounds = () => {
    if (properties.length === 0) {
      return [[39.8283, -98.5795]]; // Center of US
    }
    return properties.map(prop => [prop.latitude, prop.longitude]);
  };

  const getRegionStyle = (feature: GeoJSON.Feature) => {
    const isSelected = feature.properties?.name === selectedRegion;
    return {
      fillColor: isSelected ? '#3b82f6' : '#60a5fa',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: isSelected ? 0.7 : 0.4
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties) {
      layer.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${feature.properties.name}</h3>
          <p class="text-sm text-gray-600">
            ${properties.filter(p => p.county === feature.properties.name).length} properties
          </p>
        </div>
      `);

      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            fillOpacity: 0.6
          });
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle(getRegionStyle(feature));
        },
        click: () => {
          if (onSelectProperty && feature.properties) {
            const regionProperties = properties.filter(
              p => p.county === feature.properties.name
            );
            if (regionProperties.length > 0) {
              onSelectProperty(regionProperties[0]);
            }
          }
        }
      });
    }
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
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
        {regions && (
          <GeoJSON
            data={regions}
            style={getRegionStyle}
            onEachFeature={onEachFeature}
          />
        )}
        <MapController 
          properties={properties} 
          selectedProperty={selectedProperty}
          regions={regions}
        />
      </MapContainer>
    </div>
  );
};

interface MapControllerProps {
  properties: Property[];
  selectedProperty?: Property;
  regions?: GeoJSON.FeatureCollection;
}

const MapController: React.FC<MapControllerProps> = ({ 
  properties, 
  selectedProperty,
  regions 
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.setView(
        [selectedProperty.latitude, selectedProperty.longitude],
        10
      );
    } else if (regions && regions.features.length > 0) {
      const bounds = L.geoJSON(regions).getBounds();
      map.fitBounds(bounds);
    } else if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds);
    }
  }, [map, properties, selectedProperty, regions]);

  return null;
};

export default MapView;