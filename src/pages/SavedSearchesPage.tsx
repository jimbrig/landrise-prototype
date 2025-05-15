import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SavedSearches from '../components/search/SavedSearches';
import { SavedSearch } from '../types';
import { fetchSavedSearches } from '../services/api';

const SavedSearchesPage: React.FC = () => {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSavedSearches = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSavedSearches();
        setSearches(data);
      } catch (error) {
        console.error('Error loading saved searches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedSearches();
  }, []);

  const handleLoadSearch = (search: SavedSearch) => {
    // In a real app, you'd store the filters in state/context and navigate to the search page
    navigate('/search');
  };

  const handleDeleteSearch = (searchId: string) => {
    // In a real app, you'd call an API to delete the search
    setSearches(searches.filter(search => search.id !== searchId));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Searches</h1>
        <p className="text-gray-600">
          Access your saved searches to quickly find properties matching your criteria.
        </p>
      </div>

      <SavedSearches 
        searches={searches} 
        onLoadSearch={handleLoadSearch}
        onDeleteSearch={handleDeleteSearch}
      />
    </div>
  );
};

export default SavedSearchesPage;