import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Ruler, Building, Star, Share2, Phone, Mail } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Button from '../components/ui/Button';
import { Property } from '../types';
import { fetchPropertyById } from '../services/api';
import { formatCurrency, formatAcres } from '../utils/formatters';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'map'>('overview');

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error('Error loading property:', error);
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

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for could not be found.
          </p>
          <Link to="/parcels">
            <Button variant="primary">Return to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src={property.images[0]}
            alt={property.address}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link 
              to="/parcels" 
              className="inline-flex items-center text-white hover:text-blue-200 transition-colors mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Search
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">{property.address}</h1>
            <div className="flex items-center text-white/90">
              <MapPin size={20} className="mr-2" />
              {property.city}, {property.state} {property.zip}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 divide-x divide-gray-200 border-b">
                <QuickStat
                  icon={<DollarSign className="text-green-600" size={24} />}
                  label="Price"
                  value={formatCurrency(property.price)}
                />
                <QuickStat
                  icon={<Ruler className="text-blue-600" size={24} />}
                  label="Size"
                  value={formatAcres(property.acres)}
                />
                <QuickStat
                  icon={<Building className="text-purple-600" size={24} />}
                  label="Zoning"
                  value={property.zoning}
                />
                <QuickStat
                  icon={<MapPin className="text-red-600" size={24} />}
                  label="County"
                  value={property.county}
                />
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <TabButton
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </TabButton>
                  <TabButton
                    active={activeTab === 'details'}
                    onClick={() => setActiveTab('details')}
                  >
                    Property Details
                  </TabButton>
                  <TabButton
                    active={activeTab === 'map'}
                    onClick={() => setActiveTab('map')}
                  >
                    Map View
                  </TabButton>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{property.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Price per Acre" value={formatCurrency(property.price / property.acres)} />
                        <DetailItem label="Property Type" value={property.zoning} />
                        <DetailItem label="County" value={property.county} />
                        <DetailItem label="State" value={property.state} />
                        <DetailItem label="ZIP Code" value={property.zip} />
                        <DetailItem label="Coordinates" value={`${property.latitude}, ${property.longitude}`} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'map' && (
                  <div className="h-[400px] rounded-lg overflow-hidden">
                    <MapContainer
                      center={[property.latitude, property.longitude]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[property.latitude, property.longitude]}>
                        <Popup>{property.address}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {formatCurrency(property.price)}
              </div>
              <div className="text-gray-600 mb-6">
                {formatCurrency(property.price / property.acres)} per acre
              </div>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  icon={<Phone size={18} />}
                >
                  Contact Agent
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Star size={18} />}
                >
                  Save Property
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Share2 size={18} />}
                >
                  Share
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2" />
                  (555) 123-4567
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-2" />
                  agent@example.com
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Property Documents</h3>
              <div className="space-y-2">
                <DocumentLink label="Property Survey" />
                <DocumentLink label="Title Report" />
                <DocumentLink label="Zoning Certificate" />
                <DocumentLink label="Environmental Report" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ icon, label, value }) => {
  return (
    <div className="p-4">
      <div className="flex items-center mb-1">
        {icon}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-semibold text-gray-800">{value}</div>
    </div>
  );
};

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ children, active, onClick }) => {
  return (
    <button
      className={`px-6 py-3 text-sm font-medium border-b-2 ${
        active
          ? 'text-green-600 border-green-600'
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  return (
    <div className="border-b border-gray-200 pb-2">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="font-medium text-gray-800">{value}</div>
    </div>
  );
};

interface DocumentLinkProps {
  label: string;
}

const DocumentLink: React.FC<DocumentLinkProps> = ({ label }) => {
  return (
    <a
      href="#"
      className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
    >
      {label}
    </a>
  );
};

export default PropertyDetailPage;