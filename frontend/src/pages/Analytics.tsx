import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, parseISO } from 'date-fns';
import { analyticsAPI } from '../services/api';
import { AnalyticsOverview, CategoryAnalysis, TrendAnalysis } from '../types/expense';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

interface DailyTrend {
  date: string;
  total_amount: number;
  expense_count: number;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsOverview | null>(null);
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<number>(6); // months
  const [trendDays, setTrendDays] = useState<number>(30); // days for trends
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overview, trends] = await Promise.all([
          analyticsAPI.getOverview(timeRange),
          analyticsAPI.getDailyTrends(trendDays)
        ]);
        setAnalyticsData(overview);
        setDailyTrends(trends.trends);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, trendDays]);

  // Fetch category details when selected
  useEffect(() => {
    if (selectedCategory) {
      const fetchCategoryDetails = async () => {
        try {
          const details = await analyticsAPI.getCategoryAnalysis(selectedCategory, 90);
          setCategoryDetails(details);
        } catch (err) {
          console.error('Category details fetch error:', err);
        }
      };
      fetchCategoryDetails();
    }
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-p5-black bg-halftone bg-repeat font-comic p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-8 animate-p5-slide-in">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-p5-yellow mx-auto mb-4"></div>
                <h2 className="text-2xl font-extrabold text-p5-white uppercase tracking-widest">Loading Analytics...</h2>
                <p className="text-p5-yellow font-bold">Crunching your financial data!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-p5-black bg-halftone bg-repeat font-comic p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-8 animate-p5-slide-in">
            <div className="bg-p5-red bg-opacity-20 border-comic border-2 border-p5-red rounded-comic p-6 text-center">
              <h2 className="text-2xl font-extrabold text-p5-red uppercase tracking-widest mb-2">Error!</h2>
              <p className="text-p5-white font-bold">{error || 'No analytics data available'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chart configurations with Persona 5 colors
  const p5Colors = ['#e60012', '#ffe600', '#0066cc', '#ff6600', '#8b00ff', '#00cc66', '#ff0066', '#00ffcc', '#cc0066', '#66cc00'];

  const categoryChartData = {
    labels: analyticsData.categories.map(cat => cat.category),
    datasets: [
      {
        data: analyticsData.categories.map(cat => cat.total_amount),
        backgroundColor: p5Colors,
        borderWidth: 3,
        borderColor: '#111',
      },
    ],
  };

  const trendsChartData = {
    labels: analyticsData.monthly_trends.map(trend => trend.period),
    datasets: [
      {
        label: 'Monthly Spending',
        data: analyticsData.monthly_trends.map(trend => trend.total_amount),
        borderColor: '#e60012',
        backgroundColor: 'rgba(230, 0, 18, 0.2)',
        borderWidth: 4,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffe600',
        pointBorderColor: '#111',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const dailyTrendsData = {
    labels: dailyTrends.map(trend => format(parseISO(trend.date), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Spending',
        data: dailyTrends.map(trend => trend.total_amount),
        borderColor: '#ffe600',
        backgroundColor: 'rgba(255, 230, 0, 0.2)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#e60012',
        pointBorderColor: '#111',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const categoryBarData = {
    labels: analyticsData.categories.map(cat => cat.category),
    datasets: [
      {
        label: 'Total Amount ($)',
        data: analyticsData.categories.map(cat => cat.total_amount),
        backgroundColor: '#e60012',
        borderColor: '#111',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Transaction Count',
        data: analyticsData.categories.map(cat => cat.expense_count * 10), // Scale for visibility
        backgroundColor: '#ffe600',
        borderColor: '#111',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
              legend: {
          position: 'top' as const,
          labels: {
            color: '#fff',
            font: {
              family: 'Comic Sans MS, cursive',
              size: 14,
              weight: 'bold' as const,
            },
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: '#111',
          titleColor: '#ffe600',
          bodyColor: '#fff',
          borderColor: '#e60012',
          borderWidth: 2,
          cornerRadius: 8,
          titleFont: {
            family: 'Comic Sans MS, cursive',
            size: 16,
            weight: 'bold' as const,
          },
          bodyFont: {
            family: 'Comic Sans MS, cursive',
            size: 14,
            weight: 'bold' as const,
          },
        },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 230, 0, 0.2)',
        },
        ticks: {
          color: '#ffe600',
          font: {
            family: 'Comic Sans MS, cursive',
            size: 12,
            weight: 'bold' as const,
          },
          callback: function(value: any) {
            return '$' + value.toFixed(0);
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 230, 0, 0.1)',
        },
        ticks: {
          color: '#ffe600',
          font: {
            family: 'Comic Sans MS, cursive',
            size: 12,
            weight: 'bold' as const,
          },
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#fff',
          font: {
            family: 'Comic Sans MS, cursive',
            size: 12,
            weight: 'bold' as const,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#111',
        titleColor: '#ffe600',
        bodyColor: '#fff',
        borderColor: '#e60012',
        borderWidth: 2,
        cornerRadius: 8,
        titleFont: {
          family: 'Comic Sans MS, cursive',
          size: 16,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: 'Comic Sans MS, cursive',
          size: 14,
          weight: 'bold' as const,
        },
        callbacks: {
          label: function(context: any) {
            const percentage = ((context.raw / analyticsData.total_expenses) * 100).toFixed(1);
            const value = context.raw;
            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="min-h-screen bg-p5-black bg-halftone bg-repeat font-comic p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold text-p5-white uppercase tracking-widest drop-shadow-lg">
                📊 Financial Analytics
              </h1>
              <p className="text-p5-yellow text-lg font-bold mt-2 uppercase">
                Dive deep into your spending patterns!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="bg-p5-black text-p5-yellow border-comic border-2 border-p5-yellow rounded-comic px-4 py-2 font-bold uppercase focus:ring-2 focus:ring-p5-red focus:border-p5-red"
              >
                <option value={3}>Last 3 months</option>
                <option value={6}>Last 6 months</option>
                <option value={12}>Last 12 months</option>
              </select>
              <select
                value={trendDays}
                onChange={(e) => setTrendDays(Number(e.target.value))}
                className="bg-p5-black text-p5-yellow border-comic border-2 border-p5-yellow rounded-comic px-4 py-2 font-bold uppercase focus:ring-2 focus:ring-p5-red focus:border-p5-red"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-p5-red border-comic border-4 rounded-comic p-4 text-center text-white hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in">
              <h3 className="text-sm font-extrabold uppercase mb-1 tracking-widest">Total Expenses</h3>
              <p className="text-3xl font-extrabold text-p5-yellow drop-shadow">
                ${analyticsData.total_expenses.toFixed(2)}
              </p>
            </div>
            <div className="bg-p5-yellow border-comic border-4 rounded-comic p-4 text-center hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-sm font-extrabold text-p5-black uppercase mb-1 tracking-widest">Total Transactions</h3>
              <p className="text-3xl font-extrabold text-p5-red drop-shadow">
                {analyticsData.expense_count}
              </p>
            </div>
            <div className="bg-p5-black border-comic border-4 border-p5-white rounded-comic p-4 text-center text-white hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-sm font-extrabold uppercase mb-1 tracking-widest">Categories</h3>
              <p className="text-3xl font-extrabold text-p5-yellow drop-shadow">
                {analyticsData.categories.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-p5-red to-p5-yellow border-comic border-4 border-p5-white rounded-comic p-4 text-center hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-sm font-extrabold text-p5-black uppercase mb-1 tracking-widest">Avg per Transaction</h3>
              <p className="text-3xl font-extrabold text-p5-black drop-shadow">
                ${analyticsData.expense_count > 0 ? (analyticsData.total_expenses / analyticsData.expense_count).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution - Doughnut Chart */}
          <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in">
            <h2 className="text-2xl font-extrabold text-p5-white uppercase mb-4 tracking-widest flex items-center">
              🍩 Spending by Category
            </h2>
            <div className="h-80 bg-p5-black bg-opacity-30 rounded-comic border-comic border-2 p-4">
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            </div>
          </div>

          {/* Monthly Trends - Line Chart */}
          <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-extrabold text-p5-white uppercase mb-4 tracking-widest flex items-center">
              📈 Monthly Trends
            </h2>
            <div className="h-80 bg-p5-black bg-opacity-30 rounded-comic border-comic border-2 p-4">
              <Line data={trendsChartData} options={chartOptions} />
            </div>
          </div>

          {/* Daily Trends - Line Chart */}
          <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-extrabold text-p5-white uppercase mb-4 tracking-widest flex items-center">
              📅 Daily Spending ({trendDays} days)
            </h2>
            <div className="h-80 bg-p5-black bg-opacity-30 rounded-comic border-comic border-2 p-4">
              <Line data={dailyTrendsData} options={chartOptions} />
            </div>
          </div>

          {/* Category Comparison - Bar Chart */}
          <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-extrabold text-p5-white uppercase mb-4 tracking-widest flex items-center">
              📊 Category Analysis
            </h2>
            <div className="h-80 bg-p5-black bg-opacity-30 rounded-comic border-comic border-2 p-4">
              <Bar data={categoryBarData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Category Details Table */}
        <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in">
          <h2 className="text-2xl font-extrabold text-p5-white uppercase mb-6 tracking-widest flex items-center">
            🎯 Category Breakdown
          </h2>
          <div className="overflow-x-auto bg-p5-black bg-opacity-30 rounded-comic border-comic border-2">
            <table className="min-w-full">
              <thead className="bg-p5-red">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-p5-white uppercase tracking-widest border-b-2 border-p5-yellow">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-p5-white uppercase tracking-widest border-b-2 border-p5-yellow">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-p5-white uppercase tracking-widest border-b-2 border-p5-yellow">
                    Percentage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-p5-white uppercase tracking-widest border-b-2 border-p5-yellow">
                    Transactions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-p5-white uppercase tracking-widest border-b-2 border-p5-yellow">
                    Average
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-p5-white uppercase tracking-widest border-b-2 border-p5-yellow">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-p5-yellow">
                {analyticsData.categories.map((category, index) => (
                  <tr key={category.category} className="hover:bg-p5-red hover:bg-opacity-20 transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-comic mr-3 border-2 border-p5-white"
                          style={{ backgroundColor: p5Colors[index] || '#6B7280' }}
                        ></div>
                        <span className="font-extrabold text-p5-white uppercase text-sm">{category.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-p5-yellow font-extrabold text-lg">
                      ${category.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-p5-black rounded-comic h-3 mr-3 border border-p5-white overflow-hidden">
                          <div 
                            className="bg-p5-red h-3 rounded-comic transition-all duration-500 animate-p5-swoosh" 
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-p5-yellow font-bold">{category.percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-p5-white font-bold">
                      {category.expense_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-p5-white font-bold">
                      ${category.average_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCategory(category.category)}
                        className="bg-p5-yellow text-p5-black px-4 py-2 rounded-comic border-comic border-2 border-p5-red hover:bg-p5-red hover:text-p5-white hover:scale-105 transition-all duration-300 text-sm font-extrabold uppercase"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Detail Modal */}
        {selectedCategory && categoryDetails && (
          <div className="fixed inset-0 bg-p5-black bg-opacity-90 overflow-y-auto h-full w-full z-50 font-comic">
            <div className="relative top-20 mx-auto p-5 border-comic border-4 w-11/12 md:w-3/4 lg:w-1/2 shadow-p5-pop rounded-comic bg-p5-card animate-p5-slide-in">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold text-p5-white uppercase tracking-widest">
                    🎯 {selectedCategory} - Detailed Analysis
                  </h3>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="bg-p5-red text-p5-white rounded-comic w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-300 border-comic border-2 border-p5-white font-extrabold text-xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-p5-red rounded-comic p-4 text-center border-comic border-2 border-p5-white">
                    <p className="text-sm text-p5-yellow font-bold uppercase">Total</p>
                    <p className="text-xl font-extrabold text-p5-white">${categoryDetails.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="bg-p5-yellow rounded-comic p-4 text-center border-comic border-2 border-p5-black">
                    <p className="text-sm text-p5-black font-bold uppercase">Count</p>
                    <p className="text-xl font-extrabold text-p5-black">{categoryDetails.expense_count}</p>
                  </div>
                  <div className="bg-p5-black rounded-comic p-4 text-center border-comic border-2 border-p5-white">
                    <p className="text-sm text-p5-yellow font-bold uppercase">Average</p>
                    <p className="text-xl font-extrabold text-p5-white">${categoryDetails.average_amount.toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-p5-red to-p5-yellow rounded-comic p-4 text-center border-comic border-2 border-p5-white">
                    <p className="text-sm text-p5-black font-bold uppercase">Range</p>
                    <p className="text-lg font-extrabold text-p5-black">
                      ${categoryDetails.min_amount.toFixed(2)} - ${categoryDetails.max_amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {categoryDetails.recent_expenses && categoryDetails.recent_expenses.length > 0 && (
                  <div>
                    <h4 className="text-lg font-extrabold text-p5-yellow uppercase mb-4 tracking-widest">Recent Expenses</h4>
                    <div className="max-h-64 overflow-y-auto bg-p5-black bg-opacity-30 rounded-comic border-comic border-2 p-4">
                      <div className="space-y-3">
                        {categoryDetails.recent_expenses.map((expense: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-p5-gray bg-opacity-50 rounded-comic border-comic border-2 border-p5-white hover:bg-opacity-70 hover:scale-105 transition-all duration-300">
                            <div>
                              <p className="font-extrabold text-p5-white uppercase text-sm">{expense.description}</p>
                              <p className="text-sm text-p5-yellow font-bold">
                                {format(parseISO(expense.date), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <span className="font-extrabold text-p5-yellow text-lg">
                              ${expense.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 