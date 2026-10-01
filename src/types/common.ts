export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiResponse<TData, TMeta = Record<string, unknown>> =
  | {
      success: true;
      data: TData;
      error: null;
      meta: TMeta;
    }
  | {
      success: false;
      data: null;
      error: ApiError;
      meta: TMeta;
    };
