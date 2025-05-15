import React, { useState, useEffect } from 'react';
import SearchForm from '../components/search/SearchForm';
import PropertyList from '../components/search/PropertyList';
import MapView from '../components/map/MapView';
import { Property, SearchFilters } from '../types';
import { fetchProperties, saveSearch } from '../services/api';
import Button from '../components/ui/Button';
import { Save } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    setActiveFilters(filters);
    
    try {
      const results = await fetchProperties(filters);
      setProperties(results);
      setSelectedProperty(undefined);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!activeFilters || !searchName) return;
    
    try {
      await saveSearch({
        name: searchName,
        filters: activeFilters,
      });
      
      setSaveDialogOpen(false);
      setSearchName('');
      // In a real app, you'd update the user's saved searches list
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Find Land</h1>
        
        {activeFilters && (
          <Button
            variant="outline"
            icon={<Save size={18} />}
            onClick={() => setSaveDialogOpen(true)}
          >
            Save Search
          </Button>
        )}
      </div>
      
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-7">
          <MapView 
            properties={properties} 
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
          />
        </div>
        
        <div className="lg:col-span-5">
          <PropertyList 
            properties={properties.slice(0, 3)} 
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <div className="mt-8">
        <PropertyList 
          properties={properties.slice(3)} 
          isLoading={isLoading}
        />
      </div>
      
      {/* Save Search Dialog */}
      {saveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Save Your Search</h3>
            
            <div className="mb-4">
              <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-1">
                Search Name
              </label>
              <input
                type="text"
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="E.g., Arizona commercial properties"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="text"
                onClick={() => setSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveSearch}
                disabled={!searchName}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;