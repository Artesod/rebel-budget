export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
  context?: {
    total_spent_30_days?: number;
    expense_count?: number;
    top_categories?: Record<string, number>;
  };
}

export interface InsightsResponse {
  insights: string[];
  recommendations: string[];
  summary: {
    total_expenses: number;
    expense_count: number;
    period_days: number;
    average_daily_spend: number;
    category_breakdown: Record<string, number>;
    top_category: string;
  };
}

export interface CategorySuggestion {
  suggested_category: string;
}

export const ExpenseCategories = [
  "Food & Dining",
  "Transportation", 
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Groceries",
  "Gas",
  "Insurance",
  "Investment",
  "Other"
] as const;

export type ExpenseCategory = typeof ExpenseCategories[number]; 