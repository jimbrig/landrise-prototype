import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PropertyDetails from '../components/property/PropertyDetails';
import MapView from '../components/map/MapView';
import Button from '../components/ui/Button';
import { Property } from '../types';
import { fetchPropertyById } from '../services/api';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchPropertyById(id);
        
        if (!data) {
          setError('Property not found');
          setProperty(null);
        } else {
          setProperty(data);
        }
      } catch (err) {
        setError('Error loading property data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{error || 'Property Not Found'}</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the property you're looking for. It may have been removed or the ID is incorrect.
          </p>
          <Link to="/search">
            <Button variant="primary">
              Return to Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-6">
        <Link to="/search" className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors">
          <ArrowLeft size={18} className="mr-1" />
          Back to Search Results
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <PropertyDetails property={property} />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Property Location</h3>
            </div>
            <div className="p-4">
              <MapView 
                properties={[property]} 
                selectedProperty={property}
                height="300px"
              />
              
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <strong>Address:</strong> {property.address}, {property.city}, {property.state} {property.zip}
                </p>
                <p>
                  <strong>County:</strong> {property.county}
                </p>
                <p>
                  <strong>Coordinates:</strong> {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Contact Information</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Interested in this property? Reach out to the seller for more information or to schedule a viewing.
              </p>
              
              <Button
                variant="primary"
                fullWidth
              >
                Contact Seller
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Similar Properties</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Looking for alternatives? Browse similar properties in the area.
              </p>
              
              <Button
                variant="outline"
                fullWidth
              >
                View Similar Properties
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;