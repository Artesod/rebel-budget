import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { AnalyticsOverview } from '../types/expense';

interface AnalyticsSummaryProps {
  months?: number;
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ months = 3 }) => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await analyticsAPI.getOverview(months);
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics');
        console.error('Analytics summary fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [months]);

  if (loading) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 h-full">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase mb-2 tracking-widest">Analytics Summary</h3>
        <div className="flex items-center justify-center h-16">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-p5-yellow"></div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 h-full">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase mb-2 tracking-widest">Analytics Summary</h3>
        <div className="bg-p5-red bg-opacity-20 border-comic border-2 border-p5-red rounded-comic p-3">
          <p className="text-p5-red text-xs font-bold">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const topCategory = analytics.categories.length > 0 ? analytics.categories[0] : null;
  const averageMonthlySpend = analytics.monthly_trends.length > 0 
    ? analytics.monthly_trends.reduce((sum, trend) => sum + trend.total_amount, 0) / analytics.monthly_trends.length
    : 0;

  return (
    <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 h-full hover:scale-105 hover:shadow-p5-pop transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase tracking-widest">Analytics Summary</h3>
        <span className="text-xs text-p5-yellow font-bold uppercase bg-p5-black bg-opacity-50 px-2 py-0.5 rounded-comic border border-p5-yellow">
          Last {months} months
        </span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-p5-blue bg-opacity-90 border-comic border-2 rounded-comic p-2 text-center hover:scale-105 transition-all duration-300">
          <p className="text-xs font-bold text-p5-white uppercase mb-1">Total Spent</p>
          <p className="text-sm lg:text-base font-extrabold text-p5-yellow drop-shadow">${analytics.total_expenses.toFixed(0)}</p>
        </div>
        <div className="bg-p5-red bg-opacity-90 border-comic border-2 rounded-comic p-2 text-center hover:scale-105 transition-all duration-300">
          <p className="text-xs font-bold text-p5-white uppercase mb-1">Transactions</p>
          <p className="text-sm lg:text-base font-extrabold text-p5-yellow drop-shadow">{analytics.expense_count}</p>
        </div>
        <div className="bg-p5-black border-comic border-2 rounded-comic p-2 text-center hover:scale-105 transition-all duration-300">
          <p className="text-xs font-bold text-p5-white uppercase mb-1">Monthly Avg</p>
          <p className="text-sm lg:text-base font-extrabold text-p5-yellow drop-shadow">${averageMonthlySpend.toFixed(0)}</p>
        </div>
        <div className="bg-p5-yellow border-comic border-2 rounded-comic p-2 text-center hover:scale-105 transition-all duration-300">
          <p className="text-xs font-bold text-p5-black uppercase mb-1">Categories</p>
          <p className="text-sm lg:text-base font-extrabold text-p5-red drop-shadow">{analytics.categories.length}</p>
        </div>
      </div>

      {/* Top Category */}
      {topCategory && (
        <div className="mb-2">
          <p className="text-xs font-bold text-p5-yellow uppercase mb-1 tracking-wider">Top Spending Category</p>
          <div className="bg-p5-gray bg-opacity-80 rounded-comic p-2 border-comic border-2 border-p5-white">
            <div className="flex justify-between items-center mb-1">
              <span className="font-extrabold text-p5-white uppercase text-xs">{topCategory.category}</span>
              <span className="text-p5-yellow font-bold text-xs">${topCategory.total_amount.toFixed(0)}</span>
            </div>
            <div className="w-full bg-p5-black rounded-comic h-1.5 border border-p5-white overflow-hidden">
              <div 
                className="bg-p5-red h-1.5 rounded-comic transition-all duration-500 animate-p5-swoosh" 
                style={{ width: `${topCategory.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-p5-yellow mt-0.5 font-bold">
              {topCategory.percentage.toFixed(1)}% of total spending
            </p>
          </div>
        </div>
      )}

      {/* Category Breakdown Preview */}
      <div className="mb-2 flex-1">
        <p className="text-xs font-bold text-p5-yellow uppercase mb-1 tracking-wider">Category Breakdown</p>
        <div className="space-y-1">
          {analytics.categories.slice(0, 3).map((category, index) => (
            <div key={category.category} className="flex items-center justify-between p-1.5 bg-p5-gray bg-opacity-50 rounded-comic border border-p5-white hover:bg-opacity-70 transition-all duration-300">
              <div className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full mr-2 border border-white flex-shrink-0"
                  style={{ 
                    backgroundColor: ['#e60012', '#ffe600', '#0066cc'][index] || '#6B7280'
                  }}
                ></div>
                <span className="text-xs text-p5-white font-bold uppercase">{category.category}</span>
              </div>
              <span className="text-xs font-extrabold text-p5-yellow">
                ${category.total_amount.toFixed(0)}
              </span>
            </div>
          ))}
          {analytics.categories.length > 3 && (
            <p className="text-xs text-p5-yellow text-center font-bold animate-p5-pop">
              +{analytics.categories.length - 3} more categories
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => navigate('/analytics')}
        className="w-full bg-p5-red text-p5-white py-1.5 px-3 rounded-comic border-comic border-2 border-p5-yellow hover:bg-red-600 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 text-xs font-extrabold uppercase tracking-wider"
      >
        View Full Analytics
      </button>
    </div>
  );
};

export default AnalyticsSummary; 