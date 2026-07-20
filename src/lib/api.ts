/**
 * API Client — Centralized HTTP layer
 * ─────────────────────────────────────────────────────────────────────────
 * All API calls go through this client. It handles:
 *  - Auth token injection (reads from localStorage by default)
 *  - Request timeout (default 10s)
 *  - Consistent error formatting
 *  - Response type parsing (JSON / text / blob)
 *
 * Usage:
 *   import { apiClient } from '@/lib/api';
 *   const data = await apiClient.get<User[]>(ENDPOINTS.users.list);
 *   const user = await apiClient.post<User>(ENDPOINTS.users.create, { name: 'Rahul' });
 *   await apiClient.patch(ENDPOINTS.users.updateStatus('u1'), { status: 'Active' });
 *   await apiClient.delete(ENDPOINTS.users.delete('u1'));
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  headers?: Record<string, string>;
  timeout?: number;
  /** set to false to skip auth token injection */
  auth?: boolean;
};

// ── DEV: hardcoded admin token (expires ~2026-07-31). Replace when expired. ──
const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjIwOTk4ODU4MjYsImlhdCI6MTc4NDUyNTgyNn0.VbN8ps-Ucul8Evkyo0X9iltdU43Fn2IDfE9cf7VtKcI';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return DEV_TOKEN;
  // localStorage token takes priority if present; otherwise fall back to dev token
  return localStorage.getItem('auth_token') || localStorage.getItem('adminToken') || DEV_TOKEN;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const { headers = {}, timeout = 10_000, auth = true } = options;

  // ── Auth Header ────────────────────────────────────────────
  if (auth) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  // ── Timeout via AbortController ────────────────────────────
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    // ── Error Handling ─────────────────────────────────────
    if (!res.ok) {
      let message = `Request failed: ${res.status} ${res.statusText}`;
      try {
        const errBody = await res.json();
        if (errBody?.message) {
          message = errBody.message;
        } else if (errBody?.detail) {
          if (Array.isArray(errBody.detail)) {
            message = errBody.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
          } else if (typeof errBody.detail === 'string') {
            message = errBody.detail;
          } else {
            message = JSON.stringify(errBody.detail);
          }
        }
      } catch { /* ignore parse error */ }
      throw new ApiError(res.status, res.statusText, message);
    }

    // ── 204 No Content ─────────────────────────────────────
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error).name === 'AbortError') {
      throw new ApiError(408, 'Request Timeout', `Request to ${url} timed out after ${timeout}ms`);
    }
    throw err;
  }
}

// ── Public API Client ──────────────────────────────────────────────
export const apiClient = {
  get: <T>(url: string, opts?: RequestOptions) =>
    request<T>('GET', url, undefined, opts),

  post: <T>(url: string, body: unknown, opts?: RequestOptions) =>
    request<T>('POST', url, body, opts),

  put: <T>(url: string, body: unknown, opts?: RequestOptions) =>
    request<T>('PUT', url, body, opts),

  patch: <T>(url: string, body: unknown, opts?: RequestOptions) =>
    request<T>('PATCH', url, body, opts),

  delete: <T = void>(url: string, opts?: RequestOptions) =>
    request<T>('DELETE', url, undefined, opts),
};
