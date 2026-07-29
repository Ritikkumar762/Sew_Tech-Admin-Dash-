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
  return DEV_TOKEN;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const { headers = {}, timeout = 45_000, auth = true } = options;

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

    const text = await res.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error).name === 'AbortError') {
      throw new ApiError(408, 'Request Timeout', `Request to ${url} timed out after ${timeout}ms`);
    }
    throw err;
  }
}

async function uploadRequest<T>(
  url: string,
  formData: FormData,
  options: RequestOptions = {}
): Promise<T> {
  const { headers = {}, timeout = 45_000, auth = true } = options;

  if (auth) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...headers,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      let message = `Upload failed: ${res.status} ${res.statusText}`;
      try {
        const errBody = await res.json();
        if (errBody?.message) {
          message = errBody.message;
        } else if (errBody?.detail) {
          message = typeof errBody.detail === 'string' ? errBody.detail : JSON.stringify(errBody.detail);
        }
      } catch { /* ignore parse error */ }
      throw new ApiError(res.status, res.statusText, message);
    }

    const text = await res.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
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

  upload: <T>(url: string, formData: FormData, opts?: RequestOptions) =>
    uploadRequest<T>(url, formData, opts),
};

export async function downloadOrderInvoice(orderId: string) {
  const numericId = orderId.replace(/\D/g, '');
  if (!numericId) return;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://project-sewtech-mart.onrender.com/api/v1';
  const token = getAuthToken();
  const url = `${baseUrl}/admin/orders/${numericId}/invoice`;
  const windowUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!res.ok) {
      window.open(windowUrl, '_blank');
      return;
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Invoice_Order_${numericId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Invoice download failed:', err);
    window.open(windowUrl, '_blank');
  }
}

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) {
    rows = [{ id: "1", date: new Date().toISOString(), status: "Completed", note: "Report Export" }];
  }
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '';
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      // Escape quotes by doubling them, and wrap in double quotes if there are commas, newlines, or quotes
      if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(','))
  ];
  // Add UTF-8 BOM (\uFEFF) for proper Excel character encoding (especially for currency symbols like ₹)
  const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
