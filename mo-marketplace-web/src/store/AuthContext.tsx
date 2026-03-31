import { createContext, useContext, useMemo, useState } from 'react';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
  signIn: (token: string, user?: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const rawUser = localStorage.getItem('auth_user');
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('token')),
  );
  const isAdmin = user?.role === 'admin';

  const signIn = (token: string, nextUser?: AuthUser | null) => {
    localStorage.setItem('token', token);
    if (nextUser) {
      localStorage.setItem('auth_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('auth_user');
    }
    setIsAuthenticated(true);
    setUser(nextUser ?? null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAdmin,
      user,
      signIn,
      logout,
    }),
    [isAuthenticated, isAdmin, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}