'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'user' | 'admin' | 'marketing';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** @deprecated use role === 'admin' */
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  /** Super admin */
  isAdmin: boolean;
  isMarketingAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeStoredUser(raw: User): User {
  if (raw.role === 'admin' || raw.role === 'marketing') {
    return { ...raw, isAdmin: raw.role === 'admin' };
  }
  if (raw.isAdmin && raw.role === 'user') {
    return { ...raw, role: 'admin', isAdmin: true };
  }
  return { ...raw, role: 'user', isAdmin: false };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        setUser(normalizeStoredUser(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const persistUser = (userData: User) => {
    const normalized = normalizeStoredUser(userData);
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email dan password harus diisi');
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Email atau password tidak sesuai');
    }

    persistUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error('Semua field harus diisi');
    }
    if (password.length < 6) {
      throw new Error('Password minimal 6 karakter');
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Gagal mendaftar');
    }

    // Auto login setelah registrasi
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isMarketingAdmin: user?.role === 'marketing',
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
