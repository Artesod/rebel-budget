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
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full">
        <h3 className="text-xl font-extrabold text-p5-white uppercase mb-4 tracking-widest">Recent Transactions</h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-p5-yellow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full">
        <h3 className="text-xl font-extrabold text-p5-white uppercase mb-4 tracking-widest">Recent Transactions</h3>
        <div className="bg-p5-red bg-opacity-20 border-comic border-2 border-p5-red rounded-comic p-4">
          <p className="text-p5-red text-sm font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full">
        <h3 className="text-xl font-extrabold text-p5-white uppercase mb-4 tracking-widest">Recent Transactions</h3>
        <div className="text-center py-8">
          <div className="text-p5-yellow mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-p5-white font-bold mb-2">No expenses yet!</p>
          <p className="text-p5-yellow text-sm">Add your first expense to get started.</p>
          <button
            onClick={() => navigate('/expenses')}
            className="mt-4 bg-p5-red text-p5-white px-4 py-2 rounded-comic border-comic border-2 border-p5-yellow hover:bg-red-600 hover:scale-105 transition-all duration-300 text-sm font-extrabold uppercase"
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
    <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-extrabold text-p5-white uppercase tracking-widest">Recent Transactions</h3>
        <span className="text-xs text-p5-yellow font-bold uppercase bg-p5-black bg-opacity-50 px-2 py-1 rounded-comic border border-p5-yellow">
          Last {expenses.length}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        {expenses.map((expense) => (
          <div 
            key={expense.id} 
            className="flex items-center justify-between p-3 bg-p5-gray bg-opacity-50 rounded-comic border-comic border-2 border-p5-white hover:scale-105 hover:bg-opacity-70 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/expenses')}
          >
            <div className="flex items-center flex-1 min-w-0">
              <div className="text-xl mr-3 flex-shrink-0">
                {getCategoryEmoji(expense.category)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-p5-white uppercase text-sm truncate">
                  {expense.description}
                </p>
                <div className="flex items-center space-x-2 text-xs">
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
              <span className="font-extrabold text-lg text-p5-red">
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
        className="w-full bg-p5-red text-p5-white py-2 px-4 rounded-comic border-comic border-2 border-p5-yellow hover:bg-red-600 hover:scale-105 hover:shadow-p5-pop transition-all duration-300 text-sm font-extrabold uppercase tracking-wider"
      >
        View All Expenses
      </button>
    </div>
  );
};

export default RecentExpenses; 