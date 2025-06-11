import axios from 'axios';
import {
  Expense,
  ExpenseCreate,
  ExpenseUpdate,
  AnalyticsOverview,
  ChatMessage,
  ChatResponse,
  InsightsResponse,
  DailyTrend,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request/Response interceptors for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Expense API
export const expenseApi = {
  // Create a new expense
  create: async (expense: ExpenseCreate): Promise<Expense> => {
    const response = await api.post('/expenses/', expense);
    return response.data;
  },

  // Get all expenses with optional filters
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Expense[]> => {
    const response = await api.get('/expenses/', { params });
    return response.data;
  },

  // Get a specific expense
  getById: async (id: number): Promise<Expense> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Update an expense
  update: async (id: number, expense: ExpenseUpdate): Promise<Expense> => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  // Delete an expense
  delete: async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/expenses/categories/list');
    return response.data;
  },
};

// AI Assistant API
export const aiApi = {
  // Chat with the AI assistant
  chat: async (message: ChatMessage): Promise<ChatResponse> => {
    const response = await api.post('/ai/chat', message);
    return response.data;
  },

  // Get financial insights
  getInsights: async (days: number = 30): Promise<InsightsResponse> => {
    const response = await api.get('/ai/insights', {
      params: { days },
    });
    return response.data;
  },

  // Get AI-suggested category for a description
  categorizeDescription: async (description: string): Promise<string> => {
    const response = await api.post('/ai/categorize', null, {
      params: { description },
    });
    return response.data.suggested_category;
  },
};

// Analytics API
export const analyticsApi = {
  // Get analytics overview
  getOverview: async (months: number = 6): Promise<AnalyticsOverview> => {
    const response = await api.get('/analytics/overview', {
      params: { months },
    });
    return response.data;
  },

  // Get category analysis
  getCategoryAnalysis: async (category: string, days: number = 90) => {
    const response = await api.get(`/analytics/category/${category}`, {
      params: { days },
    });
    return response.data;
  },

  // Get daily trends
  getDailyTrends: async (days: number = 30): Promise<{ trends: DailyTrend[] }> => {
    const response = await api.get('/analytics/trends/daily', {
      params: { days },
    });
    return response.data;
  },
};

export default api; 