import { supabase } from "./supabase";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function api<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const authHeaders = await getAuthHeaders();

  const response = await fetch(`/api${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      code: "UNKNOWN_ERROR",
      message: "An unknown error occurred",
    }));
    throw new ApiError(response.status, error.code, error.message);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Convenience methods
export const apiClient = {
  get: <T>(endpoint: string) => api<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body?: unknown) => api<T>(endpoint, { method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown) => api<T>(endpoint, { method: "PUT", body }),

  delete: <T>(endpoint: string) => api<T>(endpoint, { method: "DELETE" }),

  patch: <T>(endpoint: string, body?: unknown) => api<T>(endpoint, { method: "PATCH", body }),
};
