import React from 'react';
import { Download } from 'lucide-react';
import PropertyCard from '../property/PropertyCard';
import Button from '../ui/Button';
import { Property } from '../../types';
import { exportSearchResults } from '../../services/api';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  isLoading = false 
}) => {
  const handleExport = async () => {
    try {
      const blob = await exportSearchResults(properties);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'landrise-properties.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting results:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your search filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
        </h2>
        <Button
          variant="outline"
          size="sm"
          icon={<Download size={16} />}
          onClick={handleExport}
        >
          Export Results
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;