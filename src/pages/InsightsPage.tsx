import React from 'react';
import { LineChart, BarChart, PieChart, TrendingUp, Map, DollarSign } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const InsightsPage = () => {
  // Sample data for charts
  const priceHistoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Price per Acre',
        data: [50000, 52000, 51000, 53000, 55000, 54000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const propertyTypeData = {
    labels: ['Agricultural', 'Residential', 'Commercial', 'Industrial'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ]
      }
    ]
  };

  const regionComparisonData = {
    labels: ['Travis', 'Williamson', 'Hays', 'Bastrop'],
    datasets: [
      {
        label: 'Average Price',
        data: [750000, 650000, 550000, 450000],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Market Insights</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Last updated:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickStat
            icon={<DollarSign className="h-6 w-6 text-green-500" />}
            label="Average Price"
            value="$520,000"
            trend="+5.2%"
            isPositive={true}
          />
          <QuickStat
            icon={<Map className="h-6 w-6 text-blue-500" />}
            label="Total Listings"
            value="1,245"
            trend="+12"
            isPositive={true}
          />
          <QuickStat
            icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
            label="Market Growth"
            value="8.3%"
            trend="+2.1%"
            isPositive={true}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Price History Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <LineChart className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Price Trends</h2>
              </div>
              <select className="text-sm border rounded-md px-2 py-1">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Last 2 years</option>
              </select>
            </div>
            <div className="h-80">
              <Line
                data={priceHistoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Property Type Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <PieChart className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Property Distribution</h2>
            </div>
            <div className="h-80">
              <Pie
                data={propertyTypeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Region Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <BarChart className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Regional Analysis</h2>
            </div>
            <div className="h-80">
              <Bar
                data={regionComparisonData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Insights</h2>
            <div className="space-y-4">
              <InsightCard
                title="Growing Demand"
                description="Agricultural land demand increased by 15% in the last quarter, driven by sustainable farming initiatives."
                trend="+15%"
                isPositive={true}
              />
              <InsightCard
                title="Price Appreciation"
                description="Commercial properties in Travis County showed strong appreciation, averaging 8% annual growth."
                trend="+8%"
                isPositive={true}
              />
              <InsightCard
                title="Development Opportunities"
                description="New zoning changes in Williamson County create opportunities for mixed-use development."
                trend="New"
                isPositive={true}
              />
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
  trend: string;
  isPositive: boolean;
}

const QuickStat: React.FC<QuickStatProps> = ({ icon, label, value, trend, isPositive }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm text-gray-500">{label}</span>
        </div>
        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-gray-800">{value}</div>
    </div>
  );
};

interface InsightCardProps {
  title: string;
  description: string;
  trend: string;
  isPositive: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description, trend, isPositive }) => {
  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default InsightsPage;