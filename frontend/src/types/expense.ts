export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  category?: string;
  date?: string;
  notes?: string;
}

export interface UpdateExpenseRequest {
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
  notes?: string;
}

export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CategoryAnalysis {
  category: string;
  total_amount: number;
  percentage: number;
  expense_count: number;
  average_amount: number;
}

export interface TrendAnalysis {
  period: string;
  total_amount: number;
  expense_count: number;
  average_daily_spend: number;
}

export interface AnalyticsOverview {
  total_expenses: number;
  expense_count: number;
  categories: CategoryAnalysis[];
  monthly_trends: TrendAnalysis[];
} 