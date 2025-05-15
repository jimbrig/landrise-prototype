import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, MapPin, X } from 'lucide-react';
import Button from '../ui/Button';
import { SearchFilters } from '../../types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
  onClearFilters?: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  onSearch, 
  isLoading = false,
  onClearFilters 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
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
      distance: 50,
    },
    options: {
      hasImages: false,
      hasWater: false,
      hasUtilities: false,
      isCornerLot: false,
    },
  });

  // Check if any filters are active
  useEffect(() => {
    const checkActiveFilters = () => {
      const { location, priceRange, sizeRange, zoning, options } = filters;
      return (
        location.state !== '' ||
        location.county !== '' ||
        location.city !== '' ||
        priceRange.min !== null ||
        priceRange.max !== null ||
        sizeRange.min !== null ||
        sizeRange.max !== null ||
        zoning.length > 0 ||
        options.hasImages ||
        options.hasWater ||
        options.hasUtilities ||
        options.isCornerLot
      );
    };

    setHasActiveFilters(checkActiveFilters());
  }, [filters]);

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
  };

  const handleClearFilters = () => {
    setFilters({
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
        distance: 50,
      },
      options: {
        hasImages: false,
        hasWater: false,
        hasUtilities: false,
        isCornerLot: false,
      },
    });
    onClearFilters?.();
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Search Properties</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
          >
            <X size={16} className="mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State
          </label>
          <select
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            value={filters.location.state}
            onChange={(e) => handleInputChange('location', 'state', e.target.value)}
          >
            <option value="">Select a state</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
            <option value="CA">California</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            County
          </label>
          <select
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            value={filters.location.county}
            onChange={(e) => handleInputChange('location', 'county', e.target.value)}
            disabled={!filters.location.state}
          >
            <option value="">Select a county</option>
            <option value="Travis">Travis</option>
            <option value="Williamson">Williamson</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <select
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            value={filters.location.city}
            onChange={(e) => handleInputChange('location', 'city', e.target.value)}
            disabled={!filters.location.county}
          >
            <option value="">Select a city</option>
            <option value="Austin">Austin</option>
            <option value="Round Rock">Round Rock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Zoning
          </label>
          <select
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            value={filters.zoning[0] || ''}
            onChange={(e) => handleInputChange('zoning', '', e.target.value ? [e.target.value] : [])}
          >
            <option value="">Any</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price Range
          </label>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <input
                type="number"
                placeholder="Min"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                value={filters.priceRange.min || ''}
                onChange={(e) => handleInputChange('priceRange', 'min', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="w-1/2">
              <input
                type="number"
                placeholder="Max"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                value={filters.priceRange.max || ''}
                onChange={(e) => handleInputChange('priceRange', 'max', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Acreage
          </label>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <input
                type="number"
                placeholder="Min"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                value={filters.sizeRange.min || ''}
                onChange={(e) => handleInputChange('sizeRange', 'min', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="w-1/2">
              <input
                type="number"
                placeholder="Max"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                value={filters.sizeRange.max || ''}
                onChange={(e) => handleInputChange('sizeRange', 'max', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
        >
          <Filter size={16} className="mr-1" />
          Advanced Filters
          {showAdvanced ? (
            <ChevronUp size={16} className="ml-1" />
          ) : (
            <ChevronDown size={16} className="ml-1" />
          )}
        </button>

        <Button
          type="submit"
          variant="primary"
          icon={<Search size={18} />}
          isLoading={isLoading}
        >
          Search Properties
        </Button>
      </div>

      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                checked={filters.options.hasImages}
                onChange={(e) => handleInputChange('options', 'hasImages', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Images</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                checked={filters.options.hasWater}
                onChange={(e) => handleInputChange('options', 'hasWater', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Water Access</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                checked={filters.options.hasUtilities}
                onChange={(e) => handleInputChange('options', 'hasUtilities', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Utilities</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                checked={filters.options.isCornerLot}
                onChange={(e) => handleInputChange('options', 'isCornerLot', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Corner Lot</span>
            </label>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchForm;