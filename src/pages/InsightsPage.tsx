import React, { useState, useEffect } from 'react';
import { LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, Map, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Property } from '../types';
import { fetchProperties } from '../services/api';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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

    // Prepare data for charts
    const priceRanges = [
      '0-100k', '100k-250k', '250k-500k', '500k-1M', '1M+'
    ];

    const priceDistribution = properties.reduce((acc, p) => {
      let range = '1M+';
      if (p.price < 100000) range = '0-100k';
      else if (p.price < 250000) range = '100k-250k';
      else if (p.price < 500000) range = '250k-500k';
      else if (p.price < 1000000) range = '500k-1M';
      
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priceDistributionData = priceRanges.map(range => ({
      name: range,
      value: priceDistribution[range] || 0
    }));

    const zoningData = Object.entries(zoningDistribution).map(([name, value]) => ({
      name,
      value
    }));

    // Mock time series data for market trends
    const trendData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
      avgPrice: avgPrice * (1 + Math.sin(i / 2) * 0.1),
      inventory: properties.length * (1 + Math.cos(i / 2) * 0.2)
    }));

    return {
      totalValue,
      avgPrice,
      avgSize,
      pricePerAcre,
      zoningDistribution,
      countyDistribution,
      priceDistributionData,
      zoningData,
      trendData
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
          icon={<LineChartIcon className="text-amber-600" size={24} />}
          change="+15.7%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Price Distribution</h2>
          <div className="h-64">
            {metrics?.priceDistributionData && (
              <PieChart width={400} height={250}>
                <Pie
                  data={metrics.priceDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.priceDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Property Types</h2>
          <div className="h-64">
            {metrics?.zoningData && (
              <BarChart
                width={400}
                height={250}
                data={metrics.zoningData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            )}
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Market Trends</h2>
        <div className="h-80">
          {metrics?.trendData && (
            <LineChart
              width={800}
              height={300}
              data={metrics.trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgPrice"
                stroke="#10B981"
                name="Average Price"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="inventory"
                stroke="#3B82F6"
                name="Inventory"
              />
            </LineChart>
          )}
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