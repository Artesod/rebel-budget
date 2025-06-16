import React, { useState } from 'react';
import { Expense } from '../types/expense';
import { expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ConfirmationModal from '../components/ConfirmationModal';

type ViewMode = 'list' | 'add' | 'edit';

const SpeechBubble = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-p5-yellow text-p5-black border-p5-black';
      case 'warning':
        return 'bg-p5-red text-p5-white border-p5-white';
      default:
        return 'bg-p5-white text-p5-black border-p5-red';
    }
  };

  return (
    <div className="relative inline-block">
      <div className={`${getVariantStyles()} border-comic border-4 rounded-comic px-6 py-3 shadow-p5-pop text-lg md:text-xl font-extrabold uppercase tracking-wider animate-p5-pop`}>
        {children}
      </div>
      <svg className="absolute left-8 -bottom-3" width="30" height="15" viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 30,0 15,15" fill={variant === 'success' ? '#ffe600' : variant === 'warning' ? '#e60012' : '#fff'} stroke={variant === 'success' ? '#111' : variant === 'warning' ? '#fff' : '#e60012'} strokeWidth="2"/>
      </svg>
    </div>
  );
};

// Modern SVG Icons Component
const Icon = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
  const icons = {
    money: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    plus: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    edit: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    back: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    ),
    target: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return icons[name as keyof typeof icons] || null;
};

const Expenses: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Deletion state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    expense: null as Expense | null,
    isLoading: false
  });

  // Quick stats state
  const [quickStats, setQuickStats] = useState({
    totalThisMonth: 0,
    expenseCount: 0,
    topCategory: ''
  });

  const handleAddExpense = () => {
    setSelectedExpense(undefined);
    setViewMode('add');
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setViewMode('edit');
  };

  const handleDeleteExpense = (expense: Expense) => {
    setDeleteModal({
      isOpen: true,
      expense,
      isLoading: false
    });
  };

  const confirmDeleteExpense = async () => {
    if (!deleteModal.expense) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      await expenseAPI.deleteExpense(deleteModal.expense.id);
      setDeleteModal({ isOpen: false, expense: null, isLoading: false });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete expense:', error);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleExpenseSaved = (expense: Expense) => {
    setViewMode('list');
    setSelectedExpense(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedExpense(undefined);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getViewModeTitle = () => {
    switch (viewMode) {
      case 'add':
        return 'Add New Expense';
      case 'edit':
        return 'Edit Expense';
      default:
        return 'Expense Management';
    }
  };

  const getViewModeSubtitle = () => {
    switch (viewMode) {
      case 'add':
        return 'Track your spending and level up your financial game!';
      case 'edit':
        return 'Fine-tune your expense details like a pro!';
      default:
        return 'Master your spending, unlock financial achievements!';
    }
  };

  return (
    <div className="space-y-6 font-comic p-2 md:p-4 relative w-full min-h-screen">
      {/* Header Section - Improved Layout */}
      <div className="relative z-10 bg-p5-card border-comic border-4 rounded-comic shadow-p5 p-6 md:p-8 animate-p5-slide-in hover:scale-105 hover:shadow-p5-pop transition-all duration-300">
        {/* Main Header Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Left Side - Icon and Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-p5-red border-comic border-4 rounded-full flex items-center justify-center shadow-p5-pop animate-float flex-shrink-0">
              <Icon name={viewMode === 'add' ? 'plus' : viewMode === 'edit' ? 'edit' : 'money'} className="w-8 h-8 text-p5-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-p5-white uppercase tracking-widest mb-2 drop-shadow">
                {getViewModeTitle()}
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-p5-yellow transform -skew-x-12"></div>
                <div className="w-4 h-4 bg-p5-red transform rotate-45 border border-p5-white"></div>
                <div className="w-8 h-1 bg-p5-yellow transform skew-x-12"></div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Action Button */}
          <div className="flex-shrink-0 ml-4">
            {viewMode === 'list' && (
              <button
                onClick={handleAddExpense}
                className="bg-p5-red text-p5-white px-6 py-3 rounded-comic border-comic border-4 border-p5-white hover:bg-p5-yellow hover:text-p5-black hover:border-p5-red focus:outline-none focus:ring-4 focus:ring-p5-yellow focus:ring-offset-2 focus:ring-offset-p5-black flex items-center justify-center font-extrabold uppercase tracking-wider text-sm md:text-base shadow-p5-pop hover:scale-105 hover:shadow-p5 transition-all duration-300 animate-p5-slide-in"
                style={{ animationDelay: '0.3s' }}
              >
                <Icon name="plus" className="w-5 h-5 mr-2" />
                Add Expense
              </button>
            )}
            
            {(viewMode === 'add' || viewMode === 'edit') && (
              <button
                onClick={handleCancel}
                className="bg-p5-gray text-p5-white px-6 py-3 rounded-comic border-comic border-4 border-p5-red hover:bg-p5-black hover:border-p5-yellow focus:outline-none focus:ring-4 focus:ring-p5-red focus:ring-offset-2 focus:ring-offset-p5-black flex items-center justify-center font-extrabold uppercase tracking-wider text-sm md:text-base shadow-p5-pop hover:scale-105 transition-all duration-300"
              >
                <Icon name="back" className="w-5 h-5 mr-2" />
                Back to List
              </button>
            )}
          </div>
        </div>

        {/* Subtitle Row - Better positioned */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <SpeechBubble variant="default">
              {getViewModeSubtitle()}
            </SpeechBubble>
          </div>
          {/* Optional: Add some decorative elements on the right */}
          <div className="hidden md:flex items-center gap-2 ml-4 opacity-30">
            <div className="w-3 h-3 bg-p5-yellow transform rotate-45"></div>
            <div className="w-2 h-2 bg-p5-red rounded-full"></div>
            <div className="w-3 h-3 bg-p5-yellow transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {viewMode === 'list' && (
          <ExpenseList
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            refreshTrigger={refreshTrigger}
          />
        )}

        {(viewMode === 'add' || viewMode === 'edit') && (
          <ExpenseForm
            expense={selectedExpense}
            onSave={handleExpenseSaved}
            onCancel={handleCancel}
            isEditing={viewMode === 'edit'}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Expense"
        message={
          deleteModal.expense
            ? `Are you sure you want to delete "${deleteModal.expense.description}" (${formatAmount(deleteModal.expense.amount)})? This action cannot be undone.`
            : 'Are you sure you want to delete this expense?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteExpense}
        onCancel={() => setDeleteModal({ isOpen: false, expense: null, isLoading: false })}
        isLoading={deleteModal.isLoading}
        type="danger"
      />
    </div>
  );
};

export default Expenses; 