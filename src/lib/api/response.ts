import type { ApiError, ApiResponse } from "@/types/common";

export function ok<TData, TMeta = Record<string, unknown>>(
  data: TData,
  meta = {} as TMeta,
): ApiResponse<TData, TMeta> {
  return {
    success: true,
    data,
    error: null,
    meta,
  };
}

export function fail<TMeta = Record<string, unknown>>(
  error: ApiError,
  meta = {} as TMeta,
): ApiResponse<never, TMeta> {
  return {
    success: false,
    data: null,
    error,
    meta,
  };
}
