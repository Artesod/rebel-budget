import { aiAPI } from '../services/api';
import { InsightsResponse } from '../types/ai';

interface InsightsDashboardProps {
  days?: number;
}

const InsightsDashboard = ({ days = 30 }: InsightsDashboardProps) => {
  // This would typically use useState and useEffect
  // For now, it's a placeholder structure showing the component design
  
  const insights = [
    "Your highest spending category is Food & Dining at $450.50",
    "Your daily average spending is $25.30",
    "You've spent 15% more than last month"
  ];
  
  const recommendations = [
    "Consider setting a monthly budget to track your spending",
    "Food spending is high - consider meal planning to reduce costs",
    "Keep tracking expenses regularly for better financial insights"
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Financial Insights</h3>
      
      {/* Insights Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Key Insights
        </h4>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Recommendations
        </h4>
        <div className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Refresh Insights
        </button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default InsightsDashboard; 