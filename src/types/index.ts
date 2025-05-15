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
  financials?: PropertyFinancials;
  parcelData?: ParcelData;
}

export interface PropertyFinancials {
  developmentCosts: {
    landCost: number;
    sitework: number;
    utilities: number;
    permits: number;
    other: number;
  };
  revenue: {
    projectedSalePrice: number;
    rentalIncome?: number;
  };
  financing: {
    loanAmount: number;
    interestRate: number;
    term: number;
    monthlyPayment: number;
  };
  roi: {
    netProfit: number;
    returnOnInvestment: number;
    internalRateOfReturn: number;
    cashOnCash: number;
  };
}

export interface ParcelData {
  elevation: {
    min: number;
    max: number;
    average: number;
  };
  water: {
    bodies: {
      type: string;
      area: number;
    }[];
    percentage: number;
  };
  soil: {
    type: string;
    composition: {
      type: string;
      percentage: number;
    }[];
    percolationRate: number;
  };
  metrics: {
    flatness: number; // 0-1 scale
    squareness: number; // 0-1 scale
    waterCoverage: number; // percentage
  };
}

export interface SearchFilters {
  location: {
    state: string;
    county: string;
    city: string;
    msa?: string;
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
  subscription: 'free' | 'pro';
}