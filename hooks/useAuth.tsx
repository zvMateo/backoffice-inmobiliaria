"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginRequest } from "@/request/Auth";
import { axiosBackend } from "@/request/Properties";
import { useMutation } from "@tanstack/react-query";

type AuthUser = { id: number; name: string; email: string } | null;

type AuthContextType = {
  user: AuthUser;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setAxiosToken(token: string | null) {
  if (token) {
    axiosBackend.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosBackend.defaults.headers.common["Authorization"];
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem("auth")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { token: string; user: AuthUser };
        setUser(parsed.user ?? null);
        setToken(parsed.token ?? null);
        setAxiosToken(parsed.token ?? null);
      }
    } catch {}
    setLoading(false);
  }, []);

  const persist = useCallback(
    (next: { token: string | null; user: AuthUser }) => {
      setUser(next.user);
      setToken(next.token);
      setAxiosToken(next.token);
      try {
        if (typeof window !== "undefined") {
          if (next.token) {
            window.localStorage.setItem("auth", JSON.stringify(next));
            // set cookie for middleware (7 días)
            const maxAge = 60 * 60 * 24 * 7;
            document.cookie = `authToken=${encodeURIComponent(
              next.token
            )}; Path=/; Max-Age=${maxAge}`;
          } else {
            window.localStorage.removeItem("auth");
            // delete cookie
            document.cookie = `authToken=; Path=/; Max-Age=0`;
          }
        }
      } catch {}
    },
    []
  );

  const loginMutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      setError(null);
      return await loginRequest(email, password);
    },
    onSuccess: (res, vars) => {
      setError(null); // Limpiar errores previos
      persist({
        token: res.token,
        user: res.user ?? { id: 0, name: "Usuario", email: vars.email },
      });
    },
    onError: (err: any) => {
      console.error("Login error:", err); // Para debugging
      const message = err?.message || "Error de autenticación";
      setError(message);
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
    },
    [loginMutation]
  );

  const logout = useCallback(() => {
    persist({ token: null, user: null });
  }, [persist]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading: loading || loginMutation.isPending,
      error,
      login,
      logout,
    }),
    [user, token, loading, loginMutation.isPending, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

