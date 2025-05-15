import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Building } from 'lucide-react';
import Button from '../components/ui/Button';

interface AnalysisFormData {
  developmentCosts: {
    landCost: number;
    sitework: number;
    utilities: number;
    permits: number;
    other: number;
  };
  revenue: {
    projectedSalePrice: number;
    rentalIncome: number;
  };
  financing: {
    loanAmount: number;
    interestRate: number;
    term: number;
  };
}

const AnalysisPage: React.FC = () => {
  const [formData, setFormData] = useState<AnalysisFormData>({
    developmentCosts: {
      landCost: 0,
      sitework: 0,
      utilities: 0,
      permits: 0,
      other: 0,
    },
    revenue: {
      projectedSalePrice: 0,
      rentalIncome: 0,
    },
    financing: {
      loanAmount: 0,
      interestRate: 5.5,
      term: 30,
    },
  });

  const handleInputChange = (category: keyof AnalysisFormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const calculateTotalCosts = () => {
    const { landCost, sitework, utilities, permits, other } = formData.developmentCosts;
    return landCost + sitework + utilities + permits + other;
  };

  const calculateMonthlyPayment = () => {
    const { loanAmount, interestRate, term } = formData.financing;
    const monthlyRate = (interestRate / 100) / 12;
    const payments = term * 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    return isNaN(payment) ? 0 : payment;
  };

  const calculateROI = () => {
    const totalCosts = calculateTotalCosts();
    const { projectedSalePrice, rentalIncome } = formData.revenue;
    const annualIncome = rentalIncome * 12;
    const netProfit = projectedSalePrice - totalCosts;
    const roi = (netProfit / totalCosts) * 100;
    return {
      netProfit,
      roi: isNaN(roi) ? 0 : roi,
      annualIncome
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Pro Forma Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Development Costs */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Building className="mr-2" />
              Development Costs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.developmentCosts).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange('developmentCosts', key, e.target.value)}
                      className="pl-8 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Revenue Projections */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <DollarSign className="mr-2" />
              Revenue Projections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.revenue).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange('revenue', key, e.target.value)}
                      className="pl-8 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Financing */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Calculator className="mr-2" />
              Financing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.financing.loanAmount}
                    onChange={(e) => handleInputChange('financing', 'loanAmount', e.target.value)}
                    className="pl-8 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.financing.interestRate}
                  onChange={(e) => handleInputChange('financing', 'interestRate', e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Term (Years)
                </label>
                <input
                  type="number"
                  value={formData.financing.term}
                  onChange={(e) => handleInputChange('financing', 'term', e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Results */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <TrendingUp className="mr-2" />
              Analysis Results
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Development Costs</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  ${calculateTotalCosts().toLocaleString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Payment</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  ${calculateMonthlyPayment().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  ${calculateROI().netProfit.toLocaleString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">ROI</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {calculateROI().roi.toFixed(2)}%
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Rental Income</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  ${calculateROI().annualIncome.toLocaleString()}
                </p>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  fullWidth
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;