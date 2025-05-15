import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={`${property.address} in ${property.city}, ${property.state}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">
                {property.city}, {property.state}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/property/${property.id}`} className="block">
          <h3 className="font-semibold text-lg text-gray-800 mb-1 hover:text-green-600 transition-colors">
            {property.address}
          </h3>
        </Link>

        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-xl text-green-600">
            {formatPrice(property.price)}
          </span>
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {property.zoning}
          </div>
        </div>

        <div className="flex justify-between text-gray-600 text-sm mb-4">
          <span>{property.acres} acres</span>
          <span>{property.county} County</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {property.description}
        </p>

        <Link 
          to={`/property/${property.id}`}
          className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors"
        >
          View Details
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;