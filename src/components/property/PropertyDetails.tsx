import React from 'react';
import { MapPin, Building, DollarSign, Landmark, Map, Star } from 'lucide-react';
import Button from '../ui/Button';
import { Property } from '../../types';

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPricePerAcre = (price: number, acres: number) => {
    const pricePerAcre = price / acres;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(pricePerAcre);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <div className="h-72 md:h-96 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.address}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.address}</h1>
          <div className="flex items-center text-lg">
            <MapPin size={18} className="mr-1" />
            <span>{property.city}, {property.state} {property.zip}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap -mx-3 mb-6">
          <PropertyDetailCard
            icon={<DollarSign size={20} className="text-green-600" />}
            title="Price"
            value={formatPrice(property.price)}
            subtitle={`${formatPricePerAcre(property.price, property.acres)} per acre`}
          />
          
          <PropertyDetailCard
            icon={<Map size={20} className="text-blue-600" />}
            title="Acreage"
            value={`${property.acres} acres`}
            subtitle="Land Size"
          />
          
          <PropertyDetailCard
            icon={<Building size={20} className="text-amber-600" />}
            title="Zoning"
            value={property.zoning}
            subtitle="Property Type"
          />
          
          <PropertyDetailCard
            icon={<Landmark size={20} className="text-purple-600" />}
            title="County"
            value={property.county}
            subtitle="Jurisdiction"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {property.features.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            icon={<Star size={18} />}
          >
            Save Property
          </Button>
          <Button
            variant="outline"
          >
            Contact Seller
          </Button>
          <Button
            variant="text"
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

interface PropertyDetailCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}

const PropertyDetailCard: React.FC<PropertyDetailCardProps> = ({
  icon,
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="w-full md:w-1/2 lg:w-1/4 px-3 mb-4">
      <div className="border border-gray-200 rounded-lg p-4 h-full">
        <div className="flex items-center mb-2">
          {icon}
          <span className="ml-2 text-gray-600 font-medium">{title}</span>
        </div>
        <div className="text-xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
};

export default PropertyDetails;