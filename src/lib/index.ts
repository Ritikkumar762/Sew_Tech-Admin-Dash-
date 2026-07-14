/**
 * src/lib/index.ts — Public exports for the API layer
 * Import everything from '@/lib' in your hooks and components.
 */
export { apiClient, ApiError } from './api';
export { ENDPOINTS, BASE_URL, MARKETING_BASE_URL } from './endpoints';
export { useFetch, useMutation } from './hooks';
