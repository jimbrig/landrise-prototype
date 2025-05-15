export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  price: number;
  acres: number;
  zoning: string;
  latitude: number;
  longitude: number;
  description: string;
  images: string[];
  features: string[];
}

export interface SearchFilters {
  location: {
    state: string;
    county: string;
    city: string;
  };
  priceRange: {
    min: number | null;
    max: number | null;
  };
  sizeRange: {
    min: number | null;
    max: number | null;
  };
  zoning: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  savedSearches: SavedSearch[];
  savedProperties: string[];
}