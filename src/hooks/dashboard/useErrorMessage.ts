"use client";

import { useCallback } from "react";
import { ApiError } from "@/lib/dashboard/api";
import { useAuth } from "@/components/dashboard/auth/AuthProvider";

/** Turns any error into a message, and sends the user to the login page if the session has ended. */
export function useErrorMessage() {
  const { expire } = useAuth();
  return useCallback(
    (e: unknown): string => {
      if (e instanceof ApiError && e.status === 401) {
        expire();
        return "Your session has ended. Please sign in again.";
      }
      return e instanceof Error ? e.message : "Something went wrong.";
    },
    [expire],
  );
}
