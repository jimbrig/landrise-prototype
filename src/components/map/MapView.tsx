import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import { Property } from '../../types';

// Fix Leaflet default marker icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  const legendRef = useRef<L.Control | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const createPropertyPolygon = (property: Property): L.Polygon => {
    // Create a circular polygon around the property point
    const center: [number, number] = [property.latitude, property.longitude];
    const radius = Math.sqrt(property.acres) * 0.0025; // Approximate radius based on acres
    const points = 32;
    const polygon = turf.circle(center, radius, { steps: points });
    
    return L.polygon(polygon.geometry.coordinates[0].map(coord => [coord[1], coord[0]]), {
      color: selectedProperty?.id === property.id ? '#2563eb' : '#4b5563',
      weight: selectedProperty?.id === property.id ? 3 : 1,
      fillColor: getPriceColor(property.price / property.acres),
      fillOpacity: 0.6
    });
  };

  const getPriceColor = (pricePerAcre: number): string => {
    if (pricePerAcre > 100000) return '#ef4444';
    if (pricePerAcre > 50000) return '#f59e0b';
    if (pricePerAcre > 25000) return '#10b981';
    return '#60a5fa';
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapController
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={onSelectProperty}
          legendRef={legendRef}
          layerGroupRef={layerGroupRef}
        />
      </MapContainer>
    </div>
  );
};

interface MapControllerProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelectProperty?: (property: Property) => void;
  legendRef: React.RefObject<L.Control | null>;
  layerGroupRef: React.RefObject<L.LayerGroup | null>;
}

const MapController: React.FC<MapControllerProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  legendRef,
  layerGroupRef
}) => {
  const map = useMap();

  useEffect(() => {
    // Remove existing legend if it exists
    if (legendRef.current) {
      map.removeControl(legendRef.current);
    }

    // Create and add new legend
    const legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '4px';
      div.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';

      const prices = [0, 25000, 50000, 100000];
      const colors = ['#60a5fa', '#10b981', '#f59e0b', '#ef4444'];
      
      div.innerHTML = '<h4 style="margin:0 0 5px;font-weight:600">Price per Acre</h4>';
      
      for (let i = 0; i < prices.length; i++) {
        div.innerHTML += 
          '<div style="display:flex;align-items:center;margin:3px 0;">' +
          `<i style="background:${colors[i]};width:18px;height:18px;margin-right:8px;border-radius:2px;"></i>` +
          `<span>${prices[i] ? '$' + prices[i].toLocaleString() + '+' : 'Under $25k'}</span>` +
          '</div>';
      }
      
      return div;
    };
    
    legend.addTo(map);
    legendRef.current = legend;

    return () => {
      if (legendRef.current) {
        map.removeControl(legendRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    // Remove existing layer group
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();
      map.removeLayer(layerGroupRef.current);
    }

    // Create new layer group
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // Add property markers and polygons
    properties.forEach(property => {
      // Create marker
      const marker = L.marker([property.latitude, property.longitude])
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${property.address}</h3>
            <p class="text-sm">${property.acres} acres</p>
            <p class="text-sm">$${property.price.toLocaleString()}</p>
          </div>
        `)
        .on('click', () => onSelectProperty?.(property));

      // Create polygon
      const center: [number, number] = [property.latitude, property.longitude];
      const radius = Math.sqrt(property.acres) * 0.0025;
      const circle = turf.circle(center, radius, { steps: 32 });
      
      const polygon = L.polygon(circle.geometry.coordinates[0].map(coord => [coord[1], coord[0]]), {
        color: selectedProperty?.id === property.id ? '#2563eb' : '#4b5563',
        weight: selectedProperty?.id === property.id ? 3 : 1,
        fillColor: getPriceColor(property.price / property.acres),
        fillOpacity: 0.6
      }).on('click', () => onSelectProperty?.(property));

      layerGroup.addLayer(marker);
      layerGroup.addLayer(polygon);
    });

    // Fit bounds if there are properties
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds.pad(0.1));
    }

    // Center on selected property
    if (selectedProperty) {
      map.setView([selectedProperty.latitude, selectedProperty.longitude], 14);
    }

    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
        map.removeLayer(layerGroupRef.current);
      }
    };
  }, [map, properties, selectedProperty, onSelectProperty]);

  const getPriceColor = (pricePerAcre: number): string => {
    if (pricePerAcre > 100000) return '#ef4444';
    if (pricePerAcre > 50000) return '#f59e0b';
    if (pricePerAcre > 25000) return '#10b981';
    return '#60a5fa';
  };

  return null;
};

export default MapView;