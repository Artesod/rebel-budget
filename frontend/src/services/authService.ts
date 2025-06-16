// Authentication types
export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
  last_login?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'finance_app_token';
  private static readonly USER_KEY = 'finance_app_user';

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }
}

// API request function with auth
async function authApiRequest<T>(
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
      window.location.href = '/login';
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await authApiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token and user data
    TokenManager.setToken(response.access_token);
    TokenManager.setUser(response.user);
    
    return response;
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await authApiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token and user data
    TokenManager.setToken(response.access_token);
    TokenManager.setUser(response.user);
    
    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await authApiRequest<MessageResponse>('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      TokenManager.removeToken();
    }
  },

  // Get current user info
  getCurrentUser: (): Promise<User> =>
    authApiRequest<User>('/auth/me'),

  // Check if user is authenticated
  isAuthenticated: (): boolean => TokenManager.isAuthenticated(),

  // Get current user from storage
  getCurrentUserFromStorage: (): User | null => TokenManager.getUser(),

  // Get token from storage
  getToken: (): string | null => TokenManager.getToken(),
};

// Export token manager for use in other services
export { TokenManager }; 