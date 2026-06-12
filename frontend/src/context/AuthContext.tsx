"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiLogin, apiLogout, apiMe, apiRegister, type AuthUser } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the initial session check is running */
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (params: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiMe()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (loginName: string, password: string) => {
    const u = await apiLogin(loginName, password);
    setUser(u);
  }, []);

  const register = useCallback(
    async (params: {
      email: string;
      password: string;
      first_name?: string;
      last_name?: string;
    }) => {
      const u = await apiRegister(params);
      setUser(u);
    },
    [],
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
