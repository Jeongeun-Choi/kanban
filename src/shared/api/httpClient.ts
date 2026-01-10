import type { ApiResponse } from "../types/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(endpoint: string, method: HttpMethod, body?: unknown): Promise<T> {
  const response = await fetch(`${import.meta.env.VITE_BASE_SERVER_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json()) as ApiResponse<T>;

  if ("error" in data) {
    throw new Error(data.error.message);
  }

  return data.data;
}

export const httpClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, "GET"),
  patch: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, "PATCH", body),
  post: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, "POST", body),
  delete: <T>(endpoint: string) => request<T>(endpoint, "DELETE"),
};
