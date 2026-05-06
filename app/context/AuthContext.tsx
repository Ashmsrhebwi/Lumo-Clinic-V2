import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clinicService } from '../services/clinicService';

interface User {
  email: string;
  role: 'admin' | 'staff';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  logout: () => void;
  resendOtp: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempUser, setTempUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('gc_user');
    const authStatus = localStorage.getItem('gc_auth');
    
    if (storedUser && authStatus === 'true') {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await clinicService.login({ email, password });
      setTempUser({ email, role: 'admin' });
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    if (!tempUser?.email) {
      setIsLoading(false);
      return false;
    }
    
    try {
      const response: any = await clinicService.verifyOtp({ email: tempUser.email, code });
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('gc_user', JSON.stringify(response.user));
        localStorage.setItem('gc_auth', 'true');
        setTempUser(null);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (): Promise<boolean> => {
    if (!tempUser?.email) return false;
    setIsLoading(true);
    try {
      await clinicService.resendOtp({ email: tempUser.email });
      return true;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await clinicService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gc_user');
    localStorage.removeItem('gc_auth');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, verifyOtp, logout, resendOtp }}>
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
