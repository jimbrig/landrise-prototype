import React from 'react';
import { LineChart, BarChart, PieChart } from 'lucide-react';

const InsightsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Property Market Insights</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Price Trends Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <LineChart className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Price Trends</h2>
            </div>
            <p className="text-gray-600">Track historical property price trends and market dynamics.</p>
          </div>

          {/* Market Analysis Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <BarChart className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Market Analysis</h2>
            </div>
            <p className="text-gray-600">Analyze market conditions and property value indicators.</p>
          </div>

          {/* Property Distribution Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <PieChart className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Property Distribution</h2>
            </div>
            <p className="text-gray-600">View property distribution by type, location, and features.</p>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Market Overview</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-4">
              Comprehensive analysis of current market conditions, trends, and forecasts to help inform your property decisions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Key Metrics</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Average Property Price</li>
                  <li>Price per Acre</li>
                  <li>Market Growth Rate</li>
                  <li>Property Type Distribution</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Featured Insights</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Seasonal Market Trends</li>
                  <li>Location Analysis</li>
                  <li>Investment Opportunities</li>
                  <li>Market Forecasts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;