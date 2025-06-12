import { 
  Expense, 
  CreateExpenseRequest, 
  UpdateExpenseRequest,
  AnalyticsOverview 
} from '../types/expense';
import { 
  ChatMessage, 
  ChatResponse, 
  InsightsResponse, 
  CategorySuggestion 
} from '../types/ai';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Expense API functions
export const expenseAPI = {
  // Get all expenses
  getExpenses: (params?: { skip?: number; limit?: number; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    
    const query = searchParams.toString();
    return apiRequest<Expense[]>(`/expenses${query ? `?${query}` : ''}`);
  },

  // Get single expense
  getExpense: (id: number) =>
    apiRequest<Expense>(`/expenses/${id}`),

  // Create expense
  createExpense: (expense: CreateExpenseRequest) =>
    apiRequest<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    }),

  // Update expense
  updateExpense: (id: number, expense: UpdateExpenseRequest) =>
    apiRequest<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    }),

  // Delete expense
  deleteExpense: (id: number) =>
    apiRequest<{ message: string }>(`/expenses/${id}`, {
      method: 'DELETE',
    }),

  // Get categories
  getCategories: () =>
    apiRequest<string[]>('/expenses/categories/list'),
};

// AI API functions
export const aiAPI = {
  // Chat with AI assistant
  chat: (message: ChatMessage) =>
    apiRequest<ChatResponse>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(message),
    }),

  // Get financial insights
  getInsights: (days?: number) => {
    const query = days ? `?days=${days}` : '';
    return apiRequest<InsightsResponse>(`/ai/insights${query}`);
  },

  // Get category suggestion
  categorizeDescription: (description: string) => {
    const params = new URLSearchParams({ description });
    return apiRequest<CategorySuggestion>(`/ai/categorize?${params}`);
  },
};

// Analytics API functions
export const analyticsAPI = {
  // Get analytics overview
  getOverview: (months?: number) => {
    const query = months ? `?months=${months}` : '';
    return apiRequest<AnalyticsOverview>(`/analytics/overview${query}`);
  },

  // Get category analysis
  getCategoryAnalysis: (category: string, days?: number) => {
    const query = days ? `?days=${days}` : '';
    return apiRequest<any>(`/analytics/category/${encodeURIComponent(category)}${query}`);
  },

  // Get daily trends
  getDailyTrends: (days?: number) => {
    const query = days ? `?days=${days}` : '';
    return apiRequest<{ trends: Array<{ date: string; total_amount: number; expense_count: number }> }>(`/analytics/trends/daily${query}`);
  },
}; 