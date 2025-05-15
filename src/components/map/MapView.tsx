import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, Rectangle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../../types';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  const [legend, setLegend] = useState<L.Control | null>(null);

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

  const getParcelStyle = (property: Property) => {
    const isSelected = selectedProperty?.id === property.id;
    const pricePerAcre = property.price / property.acres;
    
    // Color based on price per acre
    let color = '#10B981'; // Low price
    if (pricePerAcre > 50000) color = '#F59E0B'; // Medium price
    if (pricePerAcre > 100000) color = '#EF4444'; // High price

    return {
      fillColor: color,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#3B82F6' : '#666',
      fillOpacity: isSelected ? 0.7 : 0.5
    };
  };

  const createParcelPolygon = (property: Property) => {
    // Create a rough rectangle around the property point
    // In a real app, you'd use actual property boundaries
    const latOffset = 0.002 * Math.sqrt(property.acres);
    const lngOffset = 0.002 * Math.sqrt(property.acres);
    
    return [
      [property.latitude - latOffset, property.longitude - lngOffset],
      [property.latitude + latOffset, property.longitude - lngOffset],
      [property.latitude + latOffset, property.longitude + lngOffset],
      [property.latitude - latOffset, property.longitude + lngOffset]
    ];
  };

  const createLegend = (map: L.Map) => {
    const legend = new L.Control({ position: 'bottomright' });
    
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
      
      const grades = [0, 50000, 100000];
      const colors = ['#10B981', '#F59E0B', '#EF4444'];
      const labels = ['< $50k/acre', '$50k-$100k/acre', '> $100k/acre'];
      
      div.innerHTML = '<h4 style="margin:0 0 5px">Price per Acre</h4>';
      
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += 
          '<div style="display:flex;align-items:center;margin:3px 0;">' +
          `<i style="background:${colors[i]};width:18px;height:18px;margin-right:8px;border-radius:3px;"></i>` +
          `<span>${labels[i]}</span>` +
          '</div>';
      }
      
      return div;
    };
    
    return legend;
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <MapContainer
        bounds={getBounds() as L.LatLngBoundsExpression}
        style={{ height: '100%', width: '100%' }}
        zoom={4}
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {regions && (
            <LayersControl.Overlay checked name="Regions">
              <GeoJSON
                data={regions}
                style={getRegionStyle}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    const count = properties.filter(p => p.county === feature.properties.name).length;
                    layer.bindPopup(`
                      <div class="p-2">
                        <h3 class="font-semibold">${feature.properties.name}</h3>
                        <p class="text-sm text-gray-600">${count} properties</p>
                        <p class="text-sm text-gray-600">
                          Avg Price: ${formatAvgPrice(properties.filter(p => p.county === feature.properties.name))}
                        </p>
                      </div>
                    `);
                  }
                }}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>

        {properties.map(property => (
          <Rectangle
            key={property.id}
            bounds={createParcelPolygon(property) as L.LatLngBoundsExpression}
            pathOptions={getParcelStyle(property)}
            eventHandlers={{
              click: () => onSelectProperty?.(property),
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.8, weight: 3 });
                layer.bindPopup(`
                  <div class="p-2">
                    <h3 class="font-semibold">${property.address}</h3>
                    <p class="text-sm">${property.acres} acres</p>
                    <p class="text-sm">$${property.price.toLocaleString()}</p>
                    <p class="text-sm">${property.zoning}</p>
                  </div>
                `).openPopup();
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(getParcelStyle(property));
                layer.closePopup();
              }
            }}
          />
        ))}

        <MapController 
          properties={properties} 
          selectedProperty={selectedProperty}
          regions={regions}
          onMapLoad={(map) => {
            if (legend) map.removeControl(legend);
            const newLegend = createLegend(map);
            map.addControl(newLegend);
            setLegend(newLegend);
          }}
        />
      </MapContainer>
    </div>
  );
};

interface MapControllerProps {
  properties: Property[];
  selectedProperty?: Property;
  regions?: GeoJSON.FeatureCollection;
  onMapLoad?: (map: L.Map) => void;
}

const MapController: React.FC<MapControllerProps> = ({ 
  properties, 
  selectedProperty,
  regions,
  onMapLoad
}) => {
  const map = useMap();

  useEffect(() => {
    onMapLoad?.(map);
  }, [map, onMapLoad]);

  useEffect(() => {
    if (selectedProperty) {
      map.setView(
        [selectedProperty.latitude, selectedProperty.longitude],
        14
      );
    } else if (regions && regions.features.length > 0) {
      const bounds = L.geoJSON(regions).getBounds();
      map.fitBounds(bounds);
    } else if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds.pad(0.1));
    }
  }, [map, properties, selectedProperty, regions]);

  return null;
};

const formatAvgPrice = (properties: Property[]) => {
  if (properties.length === 0) return 'N/A';
  const avg = properties.reduce((sum, p) => sum + p.price, 0) / properties.length;
  return `$${avg.toLocaleString()}`;
};

export default MapView;