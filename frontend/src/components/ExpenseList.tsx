import React, { useState, useEffect } from 'react';
import { Expense } from '../types/expense';
import { expenseAPI } from '../services/api';

interface ExpenseListProps {
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  refreshTrigger: number;
}

// Modern SVG Icons Component
const Icon = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
  const icons = {
    money: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    chart: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    target: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    search: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    folder: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    lightning: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    edit: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    trash: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    warning: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    receipt: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5l-5-5 4-4 5 5v6a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4v5" />
      </svg>
    ),
    // Category icons
    food: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
    ),
    car: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6H4L2 4v10h3m4 0h8m0-10v10h3V4l-2 2h-9z" />
      </svg>
    ),
    shopping: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    gamepad: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    health: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    book: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    plane: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    )
  };

  return icons[name as keyof typeof icons] || <Icon name="money" className={className} />;
};

const ExpenseList: React.FC<ExpenseListProps> = ({
  onEditExpense,
  onDeleteExpense,
  refreshTrigger,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [refreshTrigger]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseAPI.getExpenses();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await expenseAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  // Stats calculations
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
  const topCategory = categories.reduce((top, category) => {
    const categoryTotal = filteredExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    const topTotal = filteredExpenses
      .filter(e => e.category === top)
      .reduce((sum, e) => sum + e.amount, 0);
    return categoryTotal > topTotal ? category : top;
  }, categories[0] || '');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'Food & Dining': 'food',
      'Transportation': 'car',
      'Shopping': 'shopping',
      'Entertainment': 'gamepad',
      'Bills & Utilities': 'lightning',
      'Healthcare': 'health',
      'Education': 'book',
      'Travel': 'plane',
      'Groceries': 'food',
      'Other': 'receipt'
    };
    return iconMap[category] || 'money';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food & Dining': 'bg-orange-500',
      'Transportation': 'bg-blue-500',
      'Shopping': 'bg-pink-500',
      'Entertainment': 'bg-purple-500',
      'Bills & Utilities': 'bg-yellow-500',
      'Healthcare': 'bg-red-500',
      'Education': 'bg-green-500',
      'Travel': 'bg-cyan-500',
      'Groceries': 'bg-emerald-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || 'bg-p5-red';
  };

  if (loading) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-8 animate-p5-slide-in">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-12 bg-p5-red border-comic border-4 rounded-full animate-p5-pop"></div>
          <div className="w-12 h-12 bg-p5-yellow border-comic border-4 rounded-full animate-p5-pop" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-12 h-12 bg-p5-white border-comic border-4 rounded-full animate-p5-pop" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-center text-p5-white font-extrabold uppercase tracking-wider mt-4">Loading Expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-p5-card border-comic border-4 border-p5-red rounded-comic shadow-p5 p-8 animate-p5-shake">
        <div className="text-center">
          <div className="w-16 h-16 bg-p5-red border-comic border-4 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="warning" className="w-8 h-8 text-p5-white" />
          </div>
          <h3 className="text-xl font-extrabold text-p5-red uppercase tracking-wider mb-2">Error Loading Expenses</h3>
          <p className="text-p5-white mb-4">{error}</p>
          <button
            onClick={fetchExpenses}
            className="bg-p5-red text-p5-white px-6 py-3 rounded-comic border-comic border-4 border-p5-white hover:bg-p5-yellow hover:text-p5-black hover:border-p5-red font-extrabold uppercase tracking-wider shadow-p5-pop hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-p5-red bg-opacity-90 border-comic border-4 rounded-comic p-6 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 animate-p5-slide-in">
          <div className="w-12 h-12 bg-p5-white border-comic border-2 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="money" className="w-6 h-6 text-p5-red" />
          </div>
          <h3 className="text-sm font-bold text-p5-white uppercase mb-1">Total Spent</h3>
          <p className="text-2xl font-extrabold text-p5-yellow drop-shadow">{formatAmount(totalAmount)}</p>
        </div>
        
        <div className="bg-p5-yellow bg-opacity-90 border-comic border-4 rounded-comic p-6 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 animate-p5-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="w-12 h-12 bg-p5-black border-comic border-2 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="chart" className="w-6 h-6 text-p5-yellow" />
          </div>
          <h3 className="text-sm font-bold text-p5-black uppercase mb-1">Average Expense</h3>
          <p className="text-2xl font-extrabold text-p5-red drop-shadow">{formatAmount(avgAmount)}</p>
        </div>
        
        <div className="bg-p5-black border-comic border-4 rounded-comic p-6 shadow-p5-pop text-center hover:scale-105 hover:shadow-p5 transition-all duration-300 animate-p5-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-12 h-12 bg-p5-red border-comic border-2 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name={getCategoryIcon(topCategory)} className="w-6 h-6 text-p5-white" />
          </div>
          <h3 className="text-sm font-bold text-p5-white uppercase mb-1">Top Category</h3>
          <p className="text-lg font-extrabold text-p5-yellow drop-shadow truncate">{topCategory || 'None'}</p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-p5-white font-bold text-sm uppercase tracking-wider mb-2 flex items-center">
              <Icon name="search" className="w-4 h-4 mr-2" />
              Search Expenses
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by description or category..."
              className="w-full px-4 py-3 bg-p5-black border-comic border-4 border-p5-red rounded-comic text-p5-white placeholder-gray-400 focus:outline-none focus:border-p5-yellow focus:ring-4 focus:ring-p5-yellow focus:ring-opacity-50 font-bold"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-p5-white font-bold text-sm uppercase tracking-wider mb-2 flex items-center">
              <Icon name="folder" className="w-4 h-4 mr-2" />
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-p5-black border-comic border-4 border-p5-red rounded-comic text-p5-white focus:outline-none focus:border-p5-yellow focus:ring-4 focus:ring-p5-yellow focus:ring-opacity-50 font-bold"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort Controls */}
          <div className="flex-1">
            <label className="block text-p5-white font-bold text-sm uppercase tracking-wider mb-2 flex items-center">
              <Icon name="lightning" className="w-4 h-4 mr-2" />
              Sort By
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
                className="flex-1 px-4 py-3 bg-p5-black border-comic border-4 border-p5-red rounded-comic text-p5-white focus:outline-none focus:border-p5-yellow focus:ring-4 focus:ring-p5-yellow focus:ring-opacity-50 font-bold"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 bg-p5-red border-comic border-4 border-p5-white rounded-comic text-p5-white hover:bg-p5-yellow hover:text-p5-black hover:border-p5-red font-extrabold shadow-p5-pop hover:scale-105 transition-all duration-300"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-p5-white uppercase tracking-widest">
            Your Expenses ({filteredExpenses.length})
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-p5-yellow transform -skew-x-12"></div>
            <div className="w-3 h-3 bg-p5-red transform rotate-45 border border-p5-white"></div>
            <div className="w-6 h-1 bg-p5-yellow transform skew-x-12"></div>
          </div>
        </div>

        {paginatedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-p5-gray border-comic border-4 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <Icon name="receipt" className="w-12 h-12 text-p5-white" />
            </div>
            <h4 className="text-xl font-extrabold text-p5-white uppercase tracking-wider mb-2">No expenses found</h4>
            <p className="text-gray-300 mb-6">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Start by adding your first expense!'}
            </p>
            {!searchTerm && !selectedCategory && (
              <div className="inline-block bg-p5-yellow text-p5-black border-comic border-4 rounded-comic px-6 py-3 font-extrabold uppercase tracking-wider animate-p5-pop">
                <Icon name="target" className="w-5 h-5 inline mr-2" />
                Ready to track your spending?
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedExpenses.map((expense, index) => (
              <div
                key={expense.id}
                className="bg-p5-black border-comic border-4 border-p5-red rounded-comic p-6 hover:border-p5-yellow hover:scale-105 hover:shadow-p5-pop transition-all duration-300 animate-p5-slide-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Category Icon */}
                    <div className={`w-12 h-12 ${getCategoryColor(expense.category)} border-comic border-2 border-p5-white rounded-full flex items-center justify-center shadow-p5-pop flex-shrink-0`}>
                      <Icon name={getCategoryIcon(expense.category)} className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Expense Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-extrabold text-p5-white uppercase tracking-wider truncate">
                        {expense.description}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-p5-yellow font-bold text-sm uppercase">
                          {expense.category}
                        </span>
                        <span className="text-gray-300 text-sm">
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-extrabold text-p5-red drop-shadow">
                        {formatAmount(expense.amount)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="w-10 h-10 bg-p5-yellow border-comic border-2 border-p5-black rounded-comic flex items-center justify-center hover:bg-p5-white hover:scale-110 transition-all duration-300 shadow-p5-pop"
                      title="Edit Expense"
                    >
                      <Icon name="edit" className="w-5 h-5 text-p5-black" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(expense)}
                      className="w-10 h-10 bg-p5-red border-comic border-2 border-p5-white rounded-comic flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-300 shadow-p5-pop"
                      title="Delete Expense"
                    >
                      <Icon name="trash" className="w-5 h-5 text-p5-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t-4 border-p5-red">
            <div className="text-p5-white font-bold">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-p5-gray border-comic border-2 border-p5-red rounded-comic text-p5-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-p5-red hover:border-p5-white hover:scale-105 transition-all duration-300"
              >
                ← Prev
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 border-comic border-2 rounded-comic font-extrabold transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-p5-red text-p5-white border-p5-white shadow-p5-pop'
                        : 'bg-p5-black text-p5-yellow border-p5-red hover:bg-p5-red hover:text-p5-white hover:border-p5-white hover:scale-105'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-p5-gray border-comic border-2 border-p5-red rounded-comic text-p5-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-p5-red hover:border-p5-white hover:scale-105 transition-all duration-300"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList; 