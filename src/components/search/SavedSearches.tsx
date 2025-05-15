import React from 'react';
import { Calendar, Clock, Trash, Search } from 'lucide-react';
import Button from '../ui/Button';
import { SavedSearch } from '../../types';

interface SavedSearchesProps {
  searches: SavedSearch[];
  onLoadSearch: (search: SavedSearch) => void;
  onDeleteSearch?: (searchId: string) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({
  searches,
  onLoadSearch,
  onDeleteSearch,
}) => {
  if (searches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Saved Searches</h3>
        <p className="text-gray-600 mb-4">
          When you save a search, it will appear here for quick access.
        </p>
        <Button variant="primary" icon={<Search size={18} />}>
          Start Searching
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searches.map((search) => (
        <div
          key={search.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-800">{search.name}</h3>
            {onDeleteSearch && (
              <button
                onClick={() => onDeleteSearch(search.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash size={18} />
              </button>
            )}
          </div>

          <div className="mt-2 space-y-2">
            <SearchFilterTag
              label="Location"
              value={[
                search.filters.location.state,
                search.filters.location.county,
                search.filters.location.city,
              ]
                .filter(Boolean)
                .join(', ') || 'Any'}
            />

            <SearchFilterTag
              label="Price"
              value={
                search.filters.priceRange.min || search.filters.priceRange.max
                  ? `${
                      search.filters.priceRange.min
                        ? '$' + search.filters.priceRange.min.toLocaleString()
                        : 'Any'
                    } - ${
                      search.filters.priceRange.max
                        ? '$' + search.filters.priceRange.max.toLocaleString()
                        : 'Any'
                    }`
                  : 'Any'
              }
            />

            <SearchFilterTag
              label="Size"
              value={
                search.filters.sizeRange.min || search.filters.sizeRange.max
                  ? `${
                      search.filters.sizeRange.min
                        ? search.filters.sizeRange.min + ' acres'
                        : 'Any'
                    } - ${
                      search.filters.sizeRange.max
                        ? search.filters.sizeRange.max + ' acres'
                        : 'Any'
                    }`
                  : 'Any'
              }
            />

            {search.filters.zoning.length > 0 && (
              <SearchFilterTag
                label="Zoning"
                value={search.filters.zoning.join(', ')}
              />
            )}
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={14} className="mr-1" />
              <span>Saved {search.createdAt}</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onLoadSearch(search)}
              icon={<Search size={14} />}
            >
              Run Search
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

interface SearchFilterTagProps {
  label: string;
  value: string;
}

const SearchFilterTag: React.FC<SearchFilterTagProps> = ({ label, value }) => {
  return (
    <div className="flex items-start">
      <span className="text-sm font-medium text-gray-600 w-20">{label}:</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
};

export default SavedSearches;