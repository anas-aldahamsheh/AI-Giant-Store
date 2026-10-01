import type { ApiError } from "@/types/common";

export class AppApiError extends Error {
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "AppApiError";
    this.code = error.code;
    this.details = error.details;
  }
}
