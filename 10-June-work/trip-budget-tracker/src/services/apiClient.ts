const TOKEN_KEY = 'trip_budget_tracker_token';

export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  message: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`/api/v1${path}`, { ...options, headers });
  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || body.status >= 400) {
    throw new ApiError(body.message || 'Request failed', res.status);
  }

  return body.data;
}

export async function fetchReceiptBlob(expenseId: string): Promise<string | null> {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`/api/v1/receipts/${expenseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
