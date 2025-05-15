import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { SearchFilters } from '../../types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [msas, setMsas] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    location: {
      state: '',
      county: '',
      city: '',
      msa: '',
      includeOutlyingCounties: false,
    },
    priceRange: {
      min: null,
      max: null,
    },
    sizeRange: {
      min: null,
      max: null,
    },
    zoning: [],
    radius: {
      enabled: false,
      center: null,
      distance: 50, // miles
    },
    options: {
      hasImages: false,
      hasWater: false,
      hasUtilities: false,
      isCornerLot: false,
    },
  });

  useEffect(() => {
    // In a real app, these would be fetched from an API
    setStates(['TX', 'FL', 'CO', 'NC', 'AZ']);
  }, []);

  useEffect(() => {
    if (filters.location.state) {
      // Fetch counties for selected state
      // For demo, using mock data
      setCounties(['Travis', 'Harris', 'Dallas']);
      setMsas(['Austin-Round Rock', 'Dallas-Fort Worth', 'Houston']);
    } else {
      setCounties([]);
      setMsas([]);
    }
  }, [filters.location.state]);

  useEffect(() => {
    if (filters.location.county) {
      // Fetch cities for selected county
      // For demo, using mock data
      setCities(['Austin', 'Round Rock', 'Cedar Park']);
    } else {
      setCities([]);
    }
  }, [filters.location.county]);

  const handleInputChange = (
    category: keyof SearchFilters,
    field: string,
    value: any
  ) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));

    // Clear dependent fields when parent changes
    if (category === 'location') {
      if (field === 'state') {
        setFilters(prev => ({
          ...prev,
          location: {
            ...prev.location,
            county: '',
            city: '',
          },
        }));
      } else if (field === 'county') {
        setFilters(prev => ({
          ...prev,
          location: {
            ...prev.location,
            city: '',
          },
        }));
      }
    }
  };

  const handleRadiusSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFilters(prev => ({
          ...prev,
          radius: {
            ...prev.radius,
            enabled: true,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
        }));
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
          <select
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={filters.location.state}
            onChange={(e) => handleInputChange('location', 'state', e.target.value)}
          >
            <option value="">Select a state</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MSA</label>
          <select
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={filters.location.msa}
            onChange={(e) => handleInputChange('location', 'msa', e.target.value)}
            disabled={!filters.location.state}
          >
            <option value="">Select an MSA</option>
            {msas.map(msa => (
              <option key={msa} value={msa}>{msa}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">County</label>
          <select
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={filters.location.county}
            onChange={(e) => handleInputChange('location', 'county', e.target.value)}
            disabled={!filters.location.state}
          >
            <option value="">Select a county</option>
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
          <select
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={filters.location.city}
            onChange={(e) => handleInputChange('location', 'city', e.target.value)}
            disabled={!filters.location.county}
          >
            <option value="">Select a city</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            checked={filters.location.includeOutlyingCounties}
            onChange={(e) => handleInputChange('location', 'includeOutlyingCounties', e.target.checked)}
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include outlying counties
          </span>
        </label>
      </div>
      
      <div className="mb-4">
        <button
          type="button"
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter size={16} className="mr-1" />
          Advanced Filters
          {showAdvanced ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </button>
      </div>
      
      {showAdvanced && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Min"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => handleInputChange('priceRange', 'min', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Max"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => handleInputChange('priceRange', 'max', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lot Size (acres)</label>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Min"
                    value={filters.sizeRange.min || ''}
                    onChange={(e) => handleInputChange('sizeRange', 'min', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Max"
                    value={filters.sizeRange.max || ''}
                    onChange={(e) => handleInputChange('sizeRange', 'max', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Radius Search</label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<MapPin size={16} />}
                onClick={handleRadiusSearch}
              >
                Use Current Location
              </Button>
              <input
                type="range"
                min="1"
                max="100"
                value={filters.radius.distance}
                onChange={(e) => handleInputChange('radius', 'distance', Number(e.target.value))}
                className="w-48"
                disabled={!filters.radius.enabled}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filters.radius.distance} miles
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Features</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  checked={filters.options.hasImages}
                  onChange={(e) => handleInputChange('options', 'hasImages', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Images</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  checked={filters.options.hasWater}
                  onChange={(e) => handleInputChange('options', 'hasWater', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Water Access</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  checked={filters.options.hasUtilities}
                  onChange={(e) => handleInputChange('options', 'hasUtilities', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Utilities</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  checked={filters.options.isCornerLot}
                  onChange={(e) => handleInputChange('options', 'isCornerLot', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Corner Lot</span>
              </label>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          variant="primary"
          icon={<Search size={18} />}
          isLoading={isLoading}
        >
          Search Properties
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;