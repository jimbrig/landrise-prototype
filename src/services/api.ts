import { Property, SavedSearch } from '../types';

// Mock data for the prototype
const mockProperties: Property[] = [
  {
    id: '1',
    address: '123 Valley Road',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    county: 'Travis',
    price: 450000,
    acres: 5.2,
    zoning: 'Residential',
    latitude: 30.2672,
    longitude: -97.7431,
    description: 'Beautiful hillside property with panoramic views of the surrounding countryside. Ideal for residential development with existing utilities nearby.',
    images: [
      'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/60638/namibia-africa-landscape-nature-60638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    features: ['Creek', 'Road Access', 'Utilities Available', 'Wooded']
  },
  {
    id: '2',
    address: '456 Highland Trail',
    city: 'Boulder',
    state: 'CO',
    zip: '80302',
    county: 'Boulder',
    price: 875000,
    acres: 12.8,
    zoning: 'Mixed Use',
    latitude: 40.0150,
    longitude: -105.2705,
    description: 'Prime development opportunity just outside Boulder city limits. Zoned for mixed-use development with excellent highway access.',
    images: [
      'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/286744/pexels-photo-286744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    features: ['Mountain Views', 'Highway Access', 'Level Terrain', 'Development Ready']
  },
  {
    id: '3',
    address: '789 Sunset Ridge',
    city: 'Asheville',
    state: 'NC',
    zip: '28801',
    county: 'Buncombe',
    price: 325000,
    acres: 3.5,
    zoning: 'Agricultural',
    latitude: 35.5951,
    longitude: -82.5515,
    description: 'Fertile agricultural land with rich soil and natural water sources. Perfect for small-scale farming or vineyard development.',
    images: [
      'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    features: ['Natural Spring', 'South-facing Slope', 'Fertile Soil', 'Existing Barn']
  },
  {
    id: '4',
    address: '101 Lakefront Drive',
    city: 'Orlando',
    state: 'FL',
    zip: '32801',
    county: 'Orange',
    price: 1250000,
    acres: 8.1,
    zoning: 'Commercial',
    latitude: 28.5383,
    longitude: -81.3792,
    description: 'Prime commercial land with lakefront views. Excellent opportunity for hospitality or retail development near major attractions.',
    images: [
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/831034/pexels-photo-831034.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    features: ['Lakefront', 'High Traffic Area', 'Near Attractions', 'Existing Infrastructure']
  },
  {
    id: '5',
    address: '202 Desert View',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85251',
    county: 'Maricopa',
    price: 575000,
    acres: 20.5,
    zoning: 'Residential',
    latitude: 33.4942,
    longitude: -111.9261,
    description: 'Expansive desert property with stunning mountain views. Ideal for luxury home development with privacy and natural beauty.',
    images: [
      'https://images.pexels.com/photos/3464632/pexels-photo-3464632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6433135/pexels-photo-6433135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    features: ['Mountain Views', 'Privacy', 'Natural Desert Landscape', 'Utilities Available']
  }
];

const mockSavedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'Austin residential lots',
    filters: {
      location: {
        state: 'TX',
        county: 'Travis',
        city: 'Austin',
      },
      priceRange: {
        min: 200000,
        max: 500000,
      },
      sizeRange: {
        min: 1,
        max: 10,
      },
      zoning: ['Residential'],
    },
    createdAt: '2025-03-15',
  },
  {
    id: '2',
    name: 'Colorado commercial opportunities',
    filters: {
      location: {
        state: 'CO',
        county: '',
        city: '',
      },
      priceRange: {
        min: 500000,
        max: 2000000,
      },
      sizeRange: {
        min: 5,
        max: null,
      },
      zoning: ['Commercial', 'Mixed Use'],
    },
    createdAt: '2025-03-10',
  }
];

// Delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API methods
export const fetchProperties = async (filters?: Partial<SearchFilters>): Promise<Property[]> => {
  await delay(600);

  if (!filters) {
    return mockProperties;
  }

  return mockProperties.filter(property => {
    let match = true;

    // Filter by location
    if (filters.location) {
      if (filters.location.state && property.state !== filters.location.state) {
        match = false;
      }
      if (filters.location.county && property.county !== filters.location.county) {
        match = false;
      }
      if (filters.location.city && property.city !== filters.location.city) {
        match = false;
      }
    }

    // Filter by price range
    if (filters.priceRange) {
      if (filters.priceRange.min !== null && property.price < filters.priceRange.min) {
        match = false;
      }
      if (filters.priceRange.max !== null && property.price > filters.priceRange.max) {
        match = false;
      }
    }

    // Filter by size range
    if (filters.sizeRange) {
      if (filters.sizeRange.min !== null && property.acres < filters.sizeRange.min) {
        match = false;
      }
      if (filters.sizeRange.max !== null && property.acres > filters.sizeRange.max) {
        match = false;
      }
    }

    // Filter by zoning
    if (filters.zoning && filters.zoning.length > 0) {
      if (!filters.zoning.includes(property.zoning)) {
        match = false;
      }
    }

    return match;
  });
};

export const fetchPropertyById = async (id: string): Promise<Property | undefined> => {
  await delay(300);
  return mockProperties.find(property => property.id === id);
};

export const fetchSavedSearches = async (): Promise<SavedSearch[]> => {
  await delay(300);
  return mockSavedSearches;
};

export const saveSearch = async (search: Omit<SavedSearch, 'id' | 'createdAt'>): Promise<SavedSearch> => {
  await delay(400);
  const newSearch: SavedSearch = {
    ...search,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  return newSearch;
};

export const exportSearchResults = async (properties: Property[]): Promise<Blob> => {
  await delay(500);
  
  const csvData = [
    // Header row
    ['ID', 'Address', 'City', 'State', 'Zip', 'County', 'Price', 'Acres', 'Zoning', 'Description'],
    // Data rows
    ...properties.map(p => [
      p.id,
      p.address,
      p.city,
      p.state,
      p.zip,
      p.county,
      p.price.toString(),
      p.acres.toString(),
      p.zoning,
      p.description
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  return new Blob([csvData], { type: 'text/csv' });
};