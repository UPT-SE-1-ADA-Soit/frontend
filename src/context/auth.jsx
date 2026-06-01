import { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_ME, MOCK_USERS } from '@/mocks/users.js';

const STORAGE_KEY = 'marketa.user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setIsInitializing(false);
    }
  }, []);

  function persist(next) {
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(next);
  }

  async function login(email /* , password */) {
    setIsLoading(true);
    try {
      // TODO: replace with POST /api/auth/login
      await new Promise((r) => setTimeout(r, 400));
      const match = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      persist(match ?? MOCK_ME);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(name, email /* , password */) {
    setIsLoading(true);
    try {
      // TODO: replace with POST /api/auth/register
      await new Promise((r) => setTimeout(r, 400));
      const newUser = {
        id: `u-${Date.now()}`,
        name: name.trim() || 'New User',
        email,
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
        location: '',
        rating: 0,
        totalSales: 0,
        joinedAt: new Date().toISOString().slice(0, 10),
      };
      persist(newUser);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    persist(null);
  }

  function updateUser(partial) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isInitializing,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
