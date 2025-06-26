import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
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
    console.log('🔄 AuthProvider: useEffect started');
    
    const initializeAuth = async () => {
      // Minimum loading time to prevent flash
      const startTime = Date.now();
      const minLoadingTime = 100; // Reduced to 100ms minimum loading
      
      try {
        if (authAPI.isAuthenticated()) {
          console.log('🔑 AuthProvider: Token found, validating...');
          // If we have a token, verify it with the server immediately
          // Don't set user from storage first to avoid flash
          try {
            const currentUser = await authAPI.getCurrentUser();
            console.log('✅ AuthProvider: User validated:', currentUser.email);
            setUser(currentUser);
          } catch (error) {
            // If server request fails, token is invalid - clear it
            console.warn('❌ AuthProvider: Token validation failed:', error);
            await authAPI.logout();
            setUser(null);
          }
        } else {
          console.log('🚫 AuthProvider: No token found');
          // No token, user is not authenticated
          setUser(null);
        }
      } catch (error) {
        console.error('💥 AuthProvider: Auth initialization error:', error);
        // Clear any invalid tokens
        await authAPI.logout();
        setUser(null);
      } finally {
        // Ensure minimum loading time to prevent flash
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        console.log(`⏱️ AuthProvider: Setting loading to false in ${remainingTime}ms`);
        setTimeout(() => {
          console.log('🏁 AuthProvider: Loading complete');
          setIsLoading(false);
        }, remainingTime);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const response = await authAPI.login({ email, password });
    setUser(response.user);
  }, []);

  const register = useCallback(async (email: string, password: string, fullName?: string): Promise<void> => {
    const response = await authAPI.register({ 
      email, 
      password, 
      full_name: fullName 
    });
    setUser(response.user);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await authAPI.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, logout the user
      await logout();
    }
  }, [logout]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const value: AuthContextType = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }), [user, isAuthenticated, isLoading, login, register, logout, refreshUser]);

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