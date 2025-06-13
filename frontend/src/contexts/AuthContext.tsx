import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          // Try to get user from storage first
          const storedUser = authAPI.getCurrentUserFromStorage();
          if (storedUser) {
            setUser(storedUser);
          }
          
          // Then refresh from server to ensure data is current
          try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // If server request fails, keep stored user but log the error
            console.warn('Failed to refresh user data:', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid tokens
        await authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authAPI.login({ email, password });
    setUser(response.user);
  };

  const register = async (email: string, password: string, fullName?: string): Promise<void> => {
    const response = await authAPI.register({ 
      email, 
      password, 
      full_name: fullName 
    });
    setUser(response.user);
  };

  const logout = async (): Promise<void> => {
    await authAPI.logout();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, logout the user
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Please log in to access this page.</div> 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-p5-black flex items-center justify-center">
        <div className="text-p5-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}; 