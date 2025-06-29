import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseAPI } from '../services/api';
import { Expense } from '../types/expense';
import { format, parseISO } from 'date-fns';

interface RecentExpensesProps {
  limit?: number;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ limit = 5 }) => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch recent expenses, sorted by creation date (most recent first)
        const data = await expenseAPI.getExpenses({ limit: limit, skip: 0 });
        setExpenses(data);
      } catch (err) {
        setError('Failed to load recent expenses');
        console.error('Recent expenses fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentExpenses();
  }, [limit]);

  if (loading) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase mb-2 tracking-widest">Recent Transactions</h3>
        <div className="flex items-center justify-center h-16">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-p5-yellow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase mb-2 tracking-widest">Recent Transactions</h3>
        <div className="bg-p5-red bg-opacity-20 border-comic border-2 border-p5-red rounded-comic p-3">
          <p className="text-p5-red text-xs font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase mb-2 tracking-widest">Recent Transactions</h3>
        <div className="text-center py-4">
          <div className="text-p5-yellow mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-p5-white font-bold mb-1 text-sm">No expenses yet!</p>
          <p className="text-p5-yellow text-xs mb-3">Add your first expense to get started.</p>
          <button
            onClick={() => navigate('/expenses')}
            className="bg-p5-red text-p5-white px-3 py-1.5 rounded-comic border-comic border-2 border-p5-yellow hover:bg-red-600 hover:scale-105 transition-all duration-300 text-xs font-extrabold uppercase"
          >
            Add Expense
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get category emoji
  const getCategoryEmoji = (category: string): string => {
    const categoryEmojis: { [key: string]: string } = {
      'Food & Dining': '🍔',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎮',
      'Bills & Utilities': '⚡',
      'Healthcare': '🏥',
      'Travel': '✈️',
      'Education': '📚',
      'Groceries': '🛒',
      'Gas': '⛽',
      'Insurance': '🛡️',
      'Investment': '📈',
      'Other': '💰'
    };
    return categoryEmojis[category] || '💳';
  };

  return (
    <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-4 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base lg:text-lg font-extrabold text-p5-white uppercase tracking-widest">Recent Transactions</h3>
        <span className="text-xs text-p5-yellow font-bold uppercase bg-p5-black bg-opacity-50 px-2 py-0.5 rounded-comic border border-p5-yellow">
          Last {expenses.length}
        </span>
      </div>
      
      <div className="space-y-2 mb-2 flex-1">
        {expenses.map((expense) => (
          <div 
            key={expense.id} 
            className="flex items-center justify-between p-2 bg-p5-gray bg-opacity-50 rounded-comic border-comic border-2 border-p5-white hover:scale-105 hover:bg-opacity-70 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/expenses')}
          >
            <div className="flex items-center flex-1 min-w-0">
              <div className="text-base mr-2 flex-shrink-0">
                {getCategoryEmoji(expense.category)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-p5-white uppercase text-xs truncate">
                  {expense.description}
                </p>
                <div className="flex items-center space-x-1 text-xs mt-0.5">
                  <span className="text-p5-yellow font-bold uppercase">
                    {expense.category}
                  </span>
                  <span className="text-p5-gray">•</span>
                  <span className="text-p5-gray font-bold">
                    {format(parseISO(expense.date), 'MMM dd')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-2 flex-shrink-0">
              <span className="font-extrabold text-sm text-p5-red">
                -${expense.amount.toFixed(2)}
              </span>
              <span className="text-xs text-p5-gray font-bold">
                {format(parseISO(expense.created_at), 'HH:mm')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button 
        onClick={() => navigate('/expenses')}
        className="w-full bg-p5-red text-p5-white py-1.5 px-3 rounded-comic border-comic border-2 border-p5-yellow hover:bg-red-600 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 text-xs font-extrabold uppercase tracking-wider"
      >
        View All Expenses
      </button>
    </div>
  );
};

export default RecentExpenses; 