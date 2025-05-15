import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, MapPin, Ruler, Building, Droplets, Mountain, Layers, LineChart } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Button from '../components/ui/Button';
import { Property } from '../types';
import { fetchPropertyById } from '../services/api';

const ParcelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'parcel'>('overview');
  const [isLoading, setIsLoading] = useState(true);

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Property Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Hero Section */}
      <div className="relative h-96">
        <div className="absolute inset-0">
          <img
            src={property.images[0]}
            alt={property.address}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<DollarSign className="text-green-600" size={24} />}
                label="Price"
                value={`$${property.price.toLocaleString()}`}
              />
              <StatCard
                icon={<Ruler className="text-blue-600" size={24} />}
                label="Acres"
                value={`${property.acres.toFixed(2)} ac`}
              />
              <StatCard
                icon={<Building className="text-purple-600" size={24} />}
                label="Zoning"
                value={property.zoning}
              />
              <StatCard
                icon={<MapPin className="text-red-600" size={24} />}
                label="County"
                value={property.county}
              />
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  <button
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'overview'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'financial'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('financial')}
                  >
                    Financial Analysis
                  </button>
                  <button
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'parcel'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('parcel')}
                  >
                    Parcel Data
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-300">{property.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Features</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Location</h3>
                      <div className="h-64 rounded-lg overflow-hidden">
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
                    </div>
                  </div>
                )}

                {activeTab === 'financial' && (
                  <div className="space-y-6">
                    {property.financials ? (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Development Costs</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(property.financials.developmentCosts).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </div>
                                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                  ${value.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">ROI Analysis</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(property.financials.roi).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </div>
                                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                  {typeof value === 'number' && key.toLowerCase().includes('rate')
                                    ? `${value.toFixed(2)}%`
                                    : `$${value.toLocaleString()}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <LineChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                          No Financial Data Available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Run a pro forma analysis to see potential returns on this property.
                        </p>
                        <Link to="/analysis">
                          <Button variant="primary">Run Pro Forma Analysis</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'parcel' && (
                  <div className="space-y-6">
                    {property.parcelData ? (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <Mountain className="mr-2" />
                            Elevation Data
                          </h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Minimum</div>
                              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                {property.parcelData.elevation.min} ft
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Maximum</div>
                              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                {property.parcelData.elevation.max} ft
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Average</div>
                              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                {property.parcelData.elevation.average} ft
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <Droplets className="mr-2" />
                            Water Features
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="mb-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Water Coverage</div>
                              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                {property.parcelData.water.percentage}%
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Water Bodies</div>
                              <div className="space-y-2">
                                {property.parcelData.water.bodies.map((body, index) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <span className="text-gray-800 dark:text-white">{body.type}</span>
                                    <span className="text-gray-600 dark:text-gray-400">{body.area} acres</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <Layers className="mr-2" />
                            Soil Composition
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="mb-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Soil Type</div>
                              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                {property.parcelData.soil.type}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Composition</div>
                              <div className="space-y-2">
                                {property.parcelData.soil.composition.map((comp, index) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <span className="text-gray-800 dark:text-white">{comp.type}</span>
                                    <span className="text-gray-600 dark:text-gray-400">{comp.percentage}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                          No Parcel Data Available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Detailed parcel data is not available for this property.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                ${property.price.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-6">
                ${(property.price / property.acres).toLocaleString()} per acre
              </div>
              <div className="space-y-3">
                <Button variant="primary" fullWidth>
                  Contact Agent
                </Button>
                <Button variant="outline" fullWidth>
                  Save Property
                </Button>
                <Button variant="outline" fullWidth>
                  Share
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Property Documents</h3>
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center mb-2">
        {icon}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
      <div className="text-lg font-semibold text-gray-800 dark:text-white">{value}</div>
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
      className="block px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
    >
      {label}
    </a>
  );
};

export default ParcelDetailPage;