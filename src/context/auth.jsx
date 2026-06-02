import { createContext, useContext, useEffect, useState } from 'react';

import { getToken, setToken } from '@/api/client.js';
import * as authService from '@/services/authService.js';

const USER_KEY = 'marketa.user';

const AuthContext = createContext(null);

function loadCachedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? loadCachedUser() : null));
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(!!getToken());

  useEffect(() => {
    if (!getToken()) {
      setIsInitializing(false);
      return;
    }
    authService
      .validateToken()
      .then((fresh) => {
        persistUser(fresh);
        setUser(fresh);
      })
      .catch(() => {
        setToken(null);
        persistUser(null);
        setUser(null);
      })
      .finally(() => setIsInitializing(false));
  }, []);

  async function login(email, password) {
    setIsLoading(true);
    try {
      const { token, user: fresh } = await authService.login(email, password);
      setToken(token);
      persistUser(fresh);
      setUser(fresh);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(name, email, password) {
    setIsLoading(true);
    try {
      const { token, user: fresh } = await authService.register({
        name,
        email,
        password,
      });
      setToken(token);
      persistUser(fresh);
      setUser(fresh);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setToken(null);
    persistUser(null);
    setUser(null);
  }

  async function updateUser(partial) {
    const fresh = await authService.updateProfile(partial);
    persistUser(fresh);
    setUser(fresh);
    return fresh;
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
