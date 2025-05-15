import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart, Map, TrendingUp, DollarSign } from 'lucide-react';
import { Property } from '../types';
import { fetchProperties } from '../services/api';

const InsightsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'size' | 'type'>('price');

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProperties();
        setProperties(Array.isArray(response) ? response : response.data || []);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const calculateMetrics = () => {
    if (properties.length === 0) return null;

    const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = totalValue / properties.length;
    const avgSize = properties.reduce((sum, p) => sum + p.acres, 0) / properties.length;
    const pricePerAcre = totalValue / properties.reduce((sum, p) => sum + p.acres, 0);

    const zoningDistribution = properties.reduce((acc, p) => {
      acc[p.zoning] = (acc[p.zoning] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const countyDistribution = properties.reduce((acc, p) => {
      acc[p.county] = (acc[p.county] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValue,
      avgPrice,
      avgSize,
      pricePerAcre,
      zoningDistribution,
      countyDistribution
    };
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Market Insights</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Property Value"
          value={metrics?.totalValue ? `$${metrics.totalValue.toLocaleString()}` : 'N/A'}
          icon={<DollarSign className="text-green-600" size={24} />}
          change="+12.5%"
        />
        <MetricCard
          title="Average Price"
          value={metrics?.avgPrice ? `$${metrics.avgPrice.toLocaleString()}` : 'N/A'}
          icon={<TrendingUp className="text-blue-600" size={24} />}
          change="+8.3%"
        />
        <MetricCard
          title="Average Size"
          value={metrics?.avgSize ? `${metrics.avgSize.toFixed(1)} acres` : 'N/A'}
          icon={<Map className="text-purple-600" size={24} />}
          change="-2.1%"
        />
        <MetricCard
          title="Price per Acre"
          value={metrics?.pricePerAcre ? `$${metrics.pricePerAcre.toLocaleString()}` : 'N/A'}
          icon={<LineChart className="text-amber-600" size={24} />}
          change="+15.7%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Price Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">
              Price distribution chart will be rendered here
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Property Types</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">
              Property types distribution chart will be rendered here
            </div>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Market Trends</h2>
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">
            Market trends chart will be rendered here
          </div>
        </div>
      </div>

      {/* Regional Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">County Distribution</h2>
          <div className="space-y-4">
            {metrics?.countyDistribution && Object.entries(metrics.countyDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([county, count]) => (
                <div key={county} className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{county}</div>
                    <div className="mt-1 relative">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div
                          style={{
                            width: `${(count / properties.length) * 100}%`
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                    {count} properties
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Zoning Distribution</h2>
          <div className="space-y-4">
            {metrics?.zoningDistribution && Object.entries(metrics.zoningDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([zoning, count]) => (
                <div key={zoning} className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{zoning}</div>
                    <div className="mt-1 relative">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div
                          style={{
                            width: `${(count / properties.length) * 100}%`
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                    {count} properties
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, change }) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          {icon}
        </div>
        <span className={`text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
    </div>
  );
};

export default InsightsPage;