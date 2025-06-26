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
import { TokenManager } from './authService';

// Automatic environment detection for API URL
const getApiBaseUrl = () => {
  // If environment variable is set, use it (for manual override)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Automatic detection based on hostname and environment
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Production detection
  if (process.env.NODE_ENV === 'production') {
    // If deployed to a domain, use the same domain for API
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}/api/v1`;
    }
  }
  
  // Development detection
  // If accessing via IP (local network), use the same IP for backend
  if (hostname.match(/^192\.168\.\d+\.\d+$/)) {
    return `http://${hostname.replace(':3000', '')}:8000/api/v1`;
  }
  
  // Default fallback for localhost
  return 'http://localhost:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Log the detected API URL for debugging
console.log(`🌐 API Base URL detected: ${API_BASE_URL}`);

// Generic API request function with authentication
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = TokenManager.getToken();
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      TokenManager.removeToken();
      window.location.href = '/';
    }
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