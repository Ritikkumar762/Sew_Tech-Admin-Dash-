/**
 * useFetch — Generic reusable data fetching hook
 * ─────────────────────────────────────────────────────────────────────────
 * Wraps apiClient.get() with loading/error/data state + optional polling.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch<User[]>(ENDPOINTS.users.list);
 *
 * With polling every 30s:
 *   const { data } = useFetch<MetricCard[]>(ENDPOINTS.dashboard.metrics, { pollInterval: 30_000 });
 */
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, ApiError } from './api';

type Options = {
  /** Auto-refetch interval in ms. Set to 0 to disable. */
  pollInterval?: number;
  /** Set to false to skip initial fetch (useful for lazy loading) */
  enabled?: boolean;
};

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(url: string, options: Options = {}) {
  const { pollInterval = 0, enabled = true } = options;
  const [state, setState] = useState<State<T>>({ data: null, loading: enabled, error: null });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await apiClient.get<T>(url);
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'An unexpected error occurred';
      setState({ data: null, loading: false, error: message });
    }
  }, [url]);

  useEffect(() => {
    if (!enabled) return;
    fetchData();

    if (pollInterval > 0) {
      intervalRef.current = setInterval(fetchData, pollInterval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, enabled, pollInterval]);

  return { ...state, refetch: fetchData };
}

/**
 * useMutation — Generic hook for POST / PATCH / DELETE calls
 *
 * Usage:
 *   const { mutate, loading, error } = useMutation<User>('PATCH', ENDPOINTS.users.updateStatus('u1'));
 *   await mutate({ status: 'Active' });
 */
export function useMutation<TResponse = void, TBody = unknown>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (body?: TBody): Promise<TResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const m = method.toLowerCase();
        let result: TResponse;
        if (m === 'delete') {
          result = await apiClient.delete<TResponse>(url);
        } else if (m === 'post') {
          result = await apiClient.post<TResponse>(url, body);
        } else if (m === 'put') {
          result = await apiClient.put<TResponse>(url, body);
        } else {
          result = await apiClient.patch<TResponse>(url, body);
        }
        return result;
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Request failed';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [method, url]
  );

  return { mutate, loading, error };
}
