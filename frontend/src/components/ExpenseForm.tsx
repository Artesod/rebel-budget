import React, { useState, useEffect } from 'react';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../types/expense';
import { expenseAPI, aiAPI } from '../services/api';

interface ExpenseFormProps {
  expense?: Expense;
  onSave: (expense: Expense) => void;
  onCancel: () => void;
  isEditing: boolean;
}

// Modern SVG Icons Component
const Icon = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
  const icons = {
    edit: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    plus: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    warning: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    robot: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    document: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5l-5-5 4-4 5 5v6a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4v5" />
      </svg>
    ),
    money: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    folder: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    clipboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    save: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
    rocket: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    x: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    lightbulb: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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

  return icons[name as keyof typeof icons] || <Icon name="document" className={className} />;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  onSave,
  onCancel,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
        notes: expense.notes || ''
      });
    }
  }, [expense]);

  const fetchCategories = async () => {
    try {
      const data = await expenseAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);

    // Trigger AI categorization for description changes
    if (name === 'description' && value.trim().length > 3 && !isEditing) {
      debouncedAICategorization(value);
    }
  };

  // Debounced AI categorization
  const debouncedAICategorization = (() => {
    let timeoutId: NodeJS.Timeout;
    return (description: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        getAICategorization(description);
      }, 1000);
    };
  })();

  const getAICategorization = async (description: string) => {
    if (!description.trim()) return;

    setIsLoadingAI(true);
    try {
      const suggestion = await aiAPI.categorizeDescription(description);
      setAiSuggestion(suggestion.suggested_category);
    } catch (err) {
      console.error('AI categorization failed:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      setFormData(prev => ({
        ...prev,
        category: aiSuggestion
      }));
      setAiSuggestion(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    if (!formData.category) {
      setError('Category is required');
      return false;
    }

    if (!formData.date) {
      setError('Date is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const expenseData = {
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes.trim() || undefined
      };

      let savedExpense: Expense;

      if (isEditing && expense) {
        savedExpense = await expenseAPI.updateExpense(expense.id, expenseData as UpdateExpenseRequest);
        setSuccess('Expense updated successfully! 🎉');
      } else {
        savedExpense = await expenseAPI.createExpense(expenseData as CreateExpenseRequest);
        setSuccess('Expense added successfully! 🎉');
      }

      setTimeout(() => {
        onSave(savedExpense);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
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
      'Other': 'document'
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

  return (
    <div className="bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-8 animate-p5-slide-in relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-4 right-4 w-16 h-16 border-4 border-p5-red transform rotate-45 animate-float"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-p5-yellow transform -rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-p5-red border-comic border-4 rounded-full flex items-center justify-center shadow-p5-pop animate-float">
            <Icon name={isEditing ? 'edit' : 'plus'} className="w-8 h-8 text-p5-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-p5-white uppercase tracking-widest mb-2 drop-shadow">
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-p5-yellow transform -skew-x-12"></div>
              <div className="w-4 h-4 bg-p5-red transform rotate-45 border border-p5-white"></div>
              <div className="w-8 h-1 bg-p5-yellow transform skew-x-12"></div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-p5-red border-comic border-4 border-p5-white rounded-comic p-4 mb-4 animate-p5-shake">
            <div className="flex items-center">
              <Icon name="warning" className="w-6 h-6 mr-3 text-p5-white" />
              <span className="text-p5-white font-extrabold uppercase tracking-wider">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-p5-yellow border-comic border-4 border-p5-black rounded-comic p-4 mb-4 animate-p5-pop">
            <div className="flex items-center">
              <Icon name="check" className="w-6 h-6 mr-3 text-p5-black" />
              <span className="text-p5-black font-extrabold uppercase tracking-wider">{success}</span>
            </div>
          </div>
        )}

        {/* AI Suggestion */}
        {aiSuggestion && (
          <div className="bg-p5-black border-comic border-4 border-p5-yellow rounded-comic p-4 mb-4 animate-p5-slide-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="robot" className="w-6 h-6 mr-3 text-p5-yellow" />
                <div>
                  <span className="text-p5-white font-bold uppercase text-sm">AI Suggestion:</span>
                  <div className="flex items-center mt-1">
                    <Icon name={getCategoryIcon(aiSuggestion)} className="w-5 h-5 mr-2 text-p5-yellow" />
                    <span className="text-p5-yellow font-extrabold">{aiSuggestion}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={applySuggestion}
                className="bg-p5-yellow text-p5-black px-4 py-2 rounded-comic border-comic border-2 border-p5-black hover:bg-p5-white hover:scale-105 font-extrabold uppercase text-sm shadow-p5-pop transition-all duration-300"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description */}
          <div className="lg:col-span-2">
            <label className="block text-p5-white font-extrabold text-lg uppercase tracking-wider mb-3 flex items-center">
              <Icon name="document" className="w-5 h-5 mr-2" />
              Description
              <span className="text-p5-red ml-1">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="What did you spend money on?"
              className="w-full px-6 py-4 bg-p5-black border-comic border-4 border-p5-red rounded-comic text-p5-white placeholder-gray-400 focus:outline-none focus:border-p5-yellow focus:ring-4 focus:ring-p5-yellow focus:ring-opacity-50 font-bold text-lg transition-all duration-300"
              required
            />
            {isLoadingAI && (
              <div className="flex items-center mt-2 text-p5-yellow">
                <div className="w-4 h-4 border-2 border-p5-yellow border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm font-bold">AI is analyzing...</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-p5-white font-extrabold text-lg uppercase tracking-wider mb-3 flex items-center">
              <Icon name="money" className="w-5 h-5 mr-2" />
              Amount
              <span className="text-p5-red ml-1">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-p5-yellow font-extrabold text-xl">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-12 pr-6 py-4 bg-p5-black border-comic border-4 border-p5-red rounded-comic text-p5-white placeholder-gray-400 focus:outline-none focus:border-p5-yellow focus:ring-4 focus:ring-p5-yellow focus:ring-opacity-50 font-bold text-lg transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-p5-white font-extrabold text-lg uppercase tracking-wider mb-3 flex items-center">
              <Icon name="folder" className="w-5 h-5 mr-2" />
              Category
              <span className="text-p5-red ml-1">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-p5-black border-comic border-4 border-p5-red rounded-comic text-p5-white focus:outline-none focus:border-p5-yellow focus:ring-4 focus:ring-p5-yellow focus:ring-opacity-50 font-bold text-lg transition-all duration-300"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-p5-white font-extrabold text-lg uppercase tracking-wider mb-3 flex items-center">
              <Icon name="calendar" className="w-5 h-5 mr-2" />
              Date
              <span className="text-p5-red ml-1">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-p5-black border-comic border-4 border-p5-red rounded-comic text-p5-white focus:outline-none focus:border-p5-yellow focus:ring-4 focus:ring-p5-yellow focus:ring-opacity-50 font-bold text-lg transition-all duration-300"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-p5-white font-extrabold text-lg uppercase tracking-wider mb-3 flex items-center">
              <Icon name="clipboard" className="w-5 h-5 mr-2" />
              Notes
              <span className="text-gray-300 text-sm ml-2">(Optional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional details..."
              rows={3}
              className="w-full px-6 py-4 bg-p5-black border-comic border-4 border-p5-red rounded-comic text-p5-white placeholder-gray-400 focus:outline-none focus:border-p5-yellow focus:ring-4 focus:ring-p5-yellow focus:ring-opacity-50 font-bold resize-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-4 border-p5-red">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-p5-red text-p5-white px-8 py-4 rounded-comic border-comic border-4 border-p5-white hover:bg-p5-yellow hover:text-p5-black hover:border-p5-red focus:outline-none focus:ring-4 focus:ring-p5-yellow focus:ring-offset-2 focus:ring-offset-p5-black flex items-center justify-center font-extrabold uppercase tracking-wider text-lg shadow-p5-pop hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
                {isEditing ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Icon name={isEditing ? 'save' : 'rocket'} className="w-6 h-6 mr-3" />
                {isEditing ? 'Update Expense' : 'Add Expense'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-p5-gray text-p5-white px-8 py-4 rounded-comic border-comic border-4 border-p5-red hover:bg-p5-black hover:border-p5-yellow focus:outline-none focus:ring-4 focus:ring-p5-red focus:ring-offset-2 focus:ring-offset-p5-black flex items-center justify-center font-extrabold uppercase tracking-wider text-lg shadow-p5-pop hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Icon name="x" className="w-6 h-6 mr-3" />
            Cancel
          </button>
        </div>
      </form>

      {/* Form Tips */}
      <div className="relative z-10 mt-8 bg-p5-black bg-opacity-50 border-comic border-2 border-p5-yellow rounded-comic p-4">
        <div className="flex items-start">
          <Icon name="lightbulb" className="w-6 h-6 mr-3 flex-shrink-0 text-p5-yellow" />
          <div>
            <h4 className="text-p5-yellow font-extrabold uppercase text-sm mb-2">Pro Tips:</h4>
            <ul className="text-p5-white text-sm space-y-1">
              <li>• Be specific in your description for better AI categorization</li>
              <li>• Use the AI suggestions to maintain consistent categories</li>
              <li>• Add notes for complex expenses to track details</li>
              <li>• Regular tracking helps you level up your financial game!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm; 