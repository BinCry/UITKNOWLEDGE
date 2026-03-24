export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: ApiError;
};

export const ok = <T>(data: T, status = 200) =>
  Response.json({ success: true, data } satisfies ApiSuccess<T>, { status });

export const fail = (error: ApiError, status = 400) =>
  Response.json({ success: false, error } satisfies ApiFailure, { status });
