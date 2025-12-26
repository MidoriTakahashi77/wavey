"use client";

import { useState, useCallback } from "react";
import { api, ApiError } from "@/lib/api";

type UseApiState<T> = {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
};

type UseApiOptions = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};

/**
 * Hook for making API calls with loading and error state
 */
export function useApi<T>(options: UseApiOptions = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (endpoint: string, requestOptions?: Parameters<typeof api>[1]) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await api<T>(endpoint, requestOptions);
        setState({ data, error: null, isLoading: false });
        options.onSuccess?.();
        return data;
      } catch (err) {
        const error =
          err instanceof ApiError ? err : new ApiError(500, "UNKNOWN_ERROR", "An error occurred");
        setState({ data: null, error, isLoading: false });
        options.onError?.(error);
        throw error;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for GET requests that fetches on mount
 */
export function useFetch<T>(endpoint: string | null) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: !!endpoint,
  });

  const refetch = useCallback(async () => {
    if (!endpoint) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await api<T>(endpoint);
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (err) {
      const error =
        err instanceof ApiError ? err : new ApiError(500, "UNKNOWN_ERROR", "An error occurred");
      setState({ data: null, error, isLoading: false });
      throw error;
    }
  }, [endpoint]);

  // Fetch on mount and when endpoint changes
  useState(() => {
    if (endpoint) {
      refetch().catch(() => {});
    }
  });

  return {
    ...state,
    refetch,
  };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<TData, TVariables = unknown>(
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const mutate = useCallback(
    async (variables?: TVariables) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await api<TData>(endpoint, {
          method,
          body: variables,
        });
        setState({ data, error: null, isLoading: false });
        options.onSuccess?.();
        return data;
      } catch (err) {
        const error =
          err instanceof ApiError ? err : new ApiError(500, "UNKNOWN_ERROR", "An error occurred");
        setState({ data: null, error, isLoading: false });
        options.onError?.(error);
        throw error;
      }
    },
    [method, endpoint, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
