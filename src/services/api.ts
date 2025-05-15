import { Property, SavedSearch } from '../types';

// Helper function for simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock property data
const mockProperties: Property[] = [
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
    description: 'Beautiful ranch property with rolling hills and natural springs. Perfect for agricultural development or private estate.',
    images: ['https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg'],
    features: ['Natural Springs', 'Rolling Hills', 'Road Frontage', 'Electricity Available']
  },
  {
    id: '2',
    address: '456 Lake View Drive',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
    county: 'Dallas',
    price: 1200000,
    acres: 25.3,
    zoning: 'Residential',
    latitude: 32.7767,
    longitude: -96.7970,
    description: 'Prime lakefront property with stunning views. Excellent opportunity for luxury residential development.',
    images: ['https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg'],
    features: ['Lake Frontage', 'Utilities Available', 'Paved Access', 'Development Ready']
  },
  {
    id: '3',
    address: '789 Forest Way',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    county: 'Harris',
    price: 750000,
    acres: 15.8,
    zoning: 'Mixed Use',
    latitude: 29.7604,
    longitude: -95.3698,
    description: 'Wooded property with excellent development potential. Close to major highways and amenities.',
    images: ['https://images.pexels.com/photos/5766696/pexels-photo-5766696.jpeg'],
    features: ['Wooded', 'Highway Access', 'Commercial Potential', 'City Water']
  },
  {
    id: '4',
    address: '321 Mountain View Road',
    city: 'Denver',
    state: 'CO',
    zip: '80201',
    county: 'Denver',
    price: 2500000,
    acres: 40.2,
    zoning: 'Recreation',
    latitude: 39.7392,
    longitude: -104.9903,
    description: 'Spectacular mountain property with year-round access. Perfect for resort development.',
    images: ['https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg'],
    features: ['Mountain Views', 'Year-Round Access', 'Recreation Potential', 'Stream']
  },
  {
    id: '5',
    address: '654 Desert Trail',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85001',
    county: 'Maricopa',
    price: 350000,
    acres: 8.7,
    zoning: 'Commercial',
    latitude: 33.4484,
    longitude: -112.0740,
    description: 'Prime commercial property in growing area. Excellent visibility and access.',
    images: ['https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg'],
    features: ['Corner Lot', 'High Traffic', 'Utilities', 'Commercial Zoning']
  },
  {
    id: '6',
    address: '987 Coastal Highway',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
    county: 'Miami-Dade',
    price: 4500000,
    acres: 12.5,
    zoning: 'Resort',
    latitude: 25.7617,
    longitude: -80.1918,
    description: 'Exclusive waterfront property with development approval for resort complex.',
    images: ['https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg'],
    features: ['Ocean Views', 'Deep Water Access', 'Resort Zoning', 'Development Ready']
  },
  {
    id: '7',
    address: '741 Valley Road',
    city: 'Charlotte',
    state: 'NC',
    zip: '28201',
    county: 'Mecklenburg',
    price: 890000,
    acres: 18.3,
    zoning: 'Agricultural',
    latitude: 35.2271,
    longitude: -80.8431,
    description: 'Fertile valley property with excellent soil. Perfect for agricultural or equestrian use.',
    images: ['https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg'],
    features: ['Rich Soil', 'Creek', 'Fenced', 'Barn']
  },
  {
    id: '8',
    address: '852 Ridge Line',
    city: 'Atlanta',
    state: 'GA',
    zip: '30301',
    county: 'Fulton',
    price: 1800000,
    acres: 30.1,
    zoning: 'Residential',
    latitude: 33.7490,
    longitude: -84.3880,
    description: 'Premium ridge-top property with city views. Approved for luxury home development.',
    images: ['https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'],
    features: ['City Views', 'Private Gates', 'Underground Utilities', 'Development Ready']
  }
];

export const fetchProperties = async (filters?: any) => {
  // Simulating API call with delay
  await delay(300);
  
  // In a real app, we would apply filters here
  return {
    data: mockProperties,
    count: mockProperties.length
  };
};

export const fetchPropertyById = async (id: string) => {
  // Simulating API call with delay
  await delay(300);
  
  return mockProperties.find(p => p.id === id);
};

export const fetchRegionBoundaries = async (state: string): Promise<GeoJSON.FeatureCollection> => {
  // This would normally fetch from a GeoJSON API or database
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

export const fetchSavedSearches = async (): Promise<SavedSearch[]> => {
  // Simulating API call with delay
  await delay(300);
  
  // Mock saved searches
  return [
    {
      id: '1',
      name: 'Texas Ranch Land',
      filters: {
        location: {
          state: 'TX',
          county: '',
          city: '',
          msa: '',
          includeOutlyingCounties: false
        },
        priceRange: {
          min: 500000,
          max: 2000000
        },
        sizeRange: {
          min: 10,
          max: 50
        },
        zoning: ['Agricultural'],
        options: {
          hasImages: true,
          hasWater: true,
          hasUtilities: true,
          isCornerLot: false
        }
      },
      createdAt: '2024-03-15T10:30:00Z'
    }
  ];
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