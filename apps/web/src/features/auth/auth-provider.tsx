"use client";

import type { CurrentUser } from "@iranautism/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { createBrowserApiClient } from "../../lib/api-client";
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  storeAccessToken,
} from "./auth-storage";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthSession = {
  accessToken: string;
  user: CurrentUser;
};

type AuthContextValue = {
  status: AuthStatus;
  user: CurrentUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  refreshCurrentUser: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const signOut = useCallback(() => {
    clearStoredAccessToken();
    setAccessToken(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    const token = getStoredAccessToken();

    if (!token) {
      signOut();
      return;
    }

    setStatus("loading");
    setAccessToken(token);

    try {
      const apiClient = createBrowserApiClient();
      const response = await apiClient.getCurrentUser();
      setUser(response.user);
      setStatus("authenticated");
    } catch {
      signOut();
    }
  }, [signOut]);

  const setSession = useCallback((session: AuthSession) => {
    storeAccessToken(session.accessToken);
    setAccessToken(session.accessToken);
    setUser(session.user);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    void refreshCurrentUser();
  }, [refreshCurrentUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      accessToken,
      isAuthenticated: status === "authenticated" && Boolean(user),
      setSession,
      refreshCurrentUser,
      signOut,
    }),
    [accessToken, refreshCurrentUser, setSession, signOut, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return value;
}
