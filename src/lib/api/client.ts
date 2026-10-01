import { AppApiError } from "@/lib/api/error";
import type { ApiResponse } from "@/types/common";

export async function apiClient<TData>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<TData> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as ApiResponse<TData>;

  if (!payload.success) {
    throw new AppApiError(payload.error);
  }

  return payload.data;
}
