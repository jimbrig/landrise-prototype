import React, { useEffect, useRef } from 'react';
import { Property } from '../../types';

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
  height = '500px',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // This is a mock implementation that would normally use a real mapping library
    // like Google Maps, Mapbox, or Leaflet. For this prototype, we'll simulate a map
    // with property markers.
    
    if (!mapRef.current) return;

    if (!scriptLoadedRef.current) {
      // Simulate map loading
      const loadMap = () => {
        if (!mapRef.current) return;
        
        const mapContainer = mapRef.current;
        
        // Clear previous map content
        while (mapContainer.firstChild) {
          mapContainer.removeChild(mapContainer.firstChild);
        }
        
        // Create mock map container
        const mapContent = document.createElement('div');
        mapContent.className = 'relative w-full h-full bg-gray-200 rounded-lg overflow-hidden';
        
        // Add a subtle topographic pattern
        mapContent.style.backgroundImage = 'url("https://transparenttextures.com/patterns/topography.png")';
        mapContent.style.backgroundSize = '600px';
        
        mapContainer.appendChild(mapContent);
        
        // Add property markers
        properties.forEach((property) => {
          const marker = document.createElement('div');
          const isSelected = selectedProperty?.id === property.id;
          
          marker.className = `absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 
                              transition-all duration-200 cursor-pointer
                              ${isSelected 
                                ? 'z-20 scale-125' 
                                : 'z-10 hover:scale-110'}`;
          
          // Position marker randomly within the map for the prototype
          // In a real implementation, we would use the property's lat/lng
          const randomX = (Math.random() * 80) + 10; // 10% to 90% of width
          const randomY = (Math.random() * 80) + 10; // 10% to 90% of height
          
          marker.style.left = `${randomX}%`;
          marker.style.top = `${randomY}%`;
          
          // Marker content
          marker.innerHTML = `
            <div class="${isSelected 
              ? 'bg-green-600 ring-4 ring-green-200' 
              : 'bg-blue-600 hover:bg-green-600'} 
              rounded-full w-full h-full flex items-center justify-center shadow-md">
              <span class="text-white text-xs font-bold">${property.id}</span>
            </div>
            ${isSelected ? `
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 
                          bg-white rounded-md shadow-lg p-2 w-48 z-30">
                <div class="text-xs font-semibold">${property.address}</div>
                <div class="text-xs text-gray-600">${property.acres} acres · $${property.price.toLocaleString()}</div>
              </div>` : ''}
          `;
          
          marker.addEventListener('click', () => {
            if (onSelectProperty) {
              onSelectProperty(property);
            }
          });
          
          mapContent.appendChild(marker);
        });
        
        // Add zoom controls for visual effect
        const zoomControls = document.createElement('div');
        zoomControls.className = 'absolute top-4 right-4 bg-white rounded-md shadow-md';
        zoomControls.innerHTML = `
          <button class="block p-2 border-b border-gray-200 hover:bg-gray-100">+</button>
          <button class="block p-2 hover:bg-gray-100">−</button>
        `;
        mapContent.appendChild(zoomControls);
        
        // Add a scale bar for visual effect
        const scaleBar = document.createElement('div');
        scaleBar.className = 'absolute bottom-4 left-4 bg-white px-2 py-1 text-xs rounded shadow-sm';
        scaleBar.textContent = '500 ft';
        mapContent.appendChild(scaleBar);
      };
      
      loadMap();
      scriptLoadedRef.current = true;
    }
  }, [properties, selectedProperty, onSelectProperty]);

  return (
    <div 
      ref={mapRef} 
      className="rounded-lg overflow-hidden shadow-md border border-gray-200"
      style={{ height }}
    >
      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
        Loading map...
      </div>
    </div>
  );
};

export default MapView;