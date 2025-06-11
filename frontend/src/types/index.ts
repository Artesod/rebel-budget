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

export interface ExpenseCreate {
  description: string;
  amount: number;
  category: string;
  date?: string;
  notes?: string;
}

export interface ExpenseUpdate {
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
  notes?: string;
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

export interface ExpensePrediction {
  predicted_amount: number;
  confidence_score: number;
  category: string;
  period: string;
}

export interface AnalyticsOverview {
  total_expenses: number;
  expense_count: number;
  categories: CategoryAnalysis[];
  monthly_trends: TrendAnalysis[];
  predictions: ExpensePrediction[];
}

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
  context: Record<string, any>;
}

export interface InsightsResponse {
  insights: string[];
  recommendations: string[];
  summary: Record<string, any>;
}

export interface DailyTrend {
  date: string;
  total_amount: number;
  expense_count: number;
}

export interface ApiError {
  detail: string;
} 