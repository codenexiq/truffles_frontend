"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/dashboard/api";
import { clearCache } from "@/lib/dashboard/cache";
import type { AdminUser } from "@/types/dashboard";

interface AuthState {
  user: AdminUser | null;
  /** true until the first "who am I" check finishes */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Called by screens when the API says the session is gone. */
  expire: () => void;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .me()
      .then((r) => alive && setUser(r.data))
      .catch((e) => {
        if (alive && !(e instanceof ApiError && e.status === 401)) console.error(e);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const r = await api.login(email, password);
    clearCache(); // a new session never sees data loaded by an earlier one
    setUser(r.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      clearCache();
      setUser(null);
      router.replace("/dashboard/login");
    }
  }, [router]);

  const expire = useCallback(() => {
    clearCache();
    setUser(null);
    router.replace("/dashboard/login");
  }, [router]);

  const value = useMemo(() => ({ user, loading, login, logout, expire }), [user, loading, login, logout, expire]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}
