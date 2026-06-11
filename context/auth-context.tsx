'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'administrator' | 'instructor' | 'assessor' | 'student';
  institution?: string;
  department?: string;
  avatar?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

type AuthResponse = {
  user: User;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      setUser(response);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // Local auth state should still be cleared if the server token is already gone.
      setUser(null);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const response = await apiClient.put<User>('/users/profile', data);
    setUser(response);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
