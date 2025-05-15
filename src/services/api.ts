// Helper function for simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProperties = async (filters?: any) => {
  // Simulating API call with delay
  await delay(300);
  
  // Mock response data
  return {
    data: [
      {
        id: '1',
        address: '123 Ranch Road',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        county: 'Travis',
        price: 500000,
        acres: 10.5,
        zoning: 'Agricultural',
        latitude: 30.2672,
        longitude: -97.7431,
        description: 'Beautiful ranch property with rolling hills',
        images: ['https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg'],
        features: ['Creek', 'Fenced', 'Road Frontage']
      }
      // Add more mock properties as needed
    ],
    count: 1
  };
};

export const fetchPropertyById = async (id: string) => {
  // Simulating API call with delay
  await delay(300);
  
  // Mock response data
  return {
    id: '1',
    address: '123 Ranch Road',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    county: 'Travis',
    price: 500000,
    acres: 10.5,
    zoning: 'Agricultural',
    latitude: 30.2672,
    longitude: -97.7431,
    description: 'Beautiful ranch property with rolling hills',
    images: ['https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg'],
    features: ['Creek', 'Fenced', 'Road Frontage']
  };
};

export const fetchRegionBoundaries = async (state: string): Promise<GeoJSON.FeatureCollection> => {
  // This would normally fetch from a GeoJSON API or database
  // For demo purposes, returning mock data
  await delay(300);
  
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Travis County',
          state: 'TX'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-97.9, 30.1],
            [-97.5, 30.1],
            [-97.5, 30.5],
            [-97.9, 30.5],
            [-97.9, 30.1]
          ]]
        }
      }
      // Add more county polygons as needed
    ]
  };
};

export const saveSearch = async (search: { name: string; filters: any }) => {
  // Simulating API call with delay
  await delay(300);
  
  // Mock successful response
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...search,
    created_at: new Date().toISOString()
  };
};

export const exportSearchResults = async (properties: any[]): Promise<Blob> => {
  // Convert properties to CSV format
  const headers = ['Address', 'City', 'State', 'Price', 'Acres', 'Zoning'];
  const rows = properties.map(property => [
    property.address,
    property.city,
    property.state,
    property.price,
    property.acres,
    property.zoning
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};