import { createContext, useContext, useMemo, useState } from 'react';

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  signIn: (token: string, user?: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('token')),
  );

  const signIn = (token: string, nextUser?: AuthUser | null) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(nextUser ?? null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      signIn,
      logout,
    }),
    [isAuthenticated, user],
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