"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

// Re-export useAuth from context
export { useAuth } from "@/contexts/AuthContext";

/**
 * Hook that redirects to login if user is not authenticated
 * Use this in protected pages
 */
export function useRequireAuth(redirectTo = "/login") {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading, isAuthenticated: !!user };
}

/**
 * Hook that redirects to dashboard if user is already authenticated
 * Use this in login/signup pages
 */
export function useRedirectIfAuthenticated(redirectTo = "/") {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading, isAuthenticated: !!user };
}
