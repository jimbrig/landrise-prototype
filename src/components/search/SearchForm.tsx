import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import Button from '../ui/Button';
import { SearchFilters } from '../../types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: {
      state: '',
      county: '',
      city: '',
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
  });

  const handleInputChange = (
    category: keyof SearchFilters,
    field: string,
    value: string | number | null
  ) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [field]: value,
      },
    });
  };

  const handleZoningChange = (zoning: string) => {
    const zoningList = [...filters.zoning];
    
    if (zoningList.includes(zoning)) {
      setFilters({
        ...filters,
        zoning: zoningList.filter(z => z !== zoning),
      });
    } else {
      setFilters({
        ...filters,
        zoning: [...zoningList, zoning],
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
      className="bg-white rounded-lg shadow-lg p-6 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            value={filters.location.state}
            onChange={(e) => handleInputChange('location', 'state', e.target.value)}
          >
            <option value="">Select a state</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
            <option value="CO">Colorado</option>
            <option value="NC">North Carolina</option>
            <option value="AZ">Arizona</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            placeholder="County"
            value={filters.location.county}
            onChange={(e) => handleInputChange('location', 'county', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            placeholder="City"
            value={filters.location.city}
            onChange={(e) => handleInputChange('location', 'city', e.target.value)}
          />
        </div>
      </div>
      
      {/* Advanced Filters */}
      <div className="mb-4">
        <button
          type="button"
          className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter size={16} className="mr-1" />
          Advanced Filters
          {showAdvanced ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </button>
      </div>
      
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                    placeholder="Min"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => handleInputChange('priceRange', 'min', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                    placeholder="Max"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => handleInputChange('priceRange', 'max', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Acreage</label>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                    placeholder="Min"
                    value={filters.sizeRange.min || ''}
                    onChange={(e) => handleInputChange('sizeRange', 'min', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                    placeholder="Max"
                    value={filters.sizeRange.max || ''}
                    onChange={(e) => handleInputChange('sizeRange', 'max', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Zoning</label>
            <div className="flex flex-wrap gap-3">
              {['Residential', 'Commercial', 'Agricultural', 'Mixed Use', 'Industrial'].map((zoning) => (
                <label 
                  key={zoning} 
                  className={`
                    inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors
                    ${filters.zoning.includes(zoning) 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}
                  `}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={filters.zoning.includes(zoning)}
                    onChange={() => handleZoningChange(zoning)}
                  />
                  {zoning}
                </label>
              ))}
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