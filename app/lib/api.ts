/**
 * Centralized API Client
 * 
 * This utility provides a reusable wrapper around the native fetch API
 * to handle common tasks like header management, JSON parsing, and error handling.
 */

const BASE_URL = import.meta.env.VITE_API_URL;
interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, ...customOptions } = options;

  const token = localStorage.getItem('token');
  const isFormData = data instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(customOptions.headers || {}),
  };

  const config: RequestInit = {
    ...customOptions,
    headers,
  };

  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  // Ensure endpoint starts with /
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: any = new Error(errorData.message || `API Error: ${response.status}`);
      
      // Preserving Laravel/API error structure
      error.status = response.status;
      error.data = errorData;
      error.errors = errorData.errors || null;
      
      throw error;
    }

    // Return empty for No Content (204)
    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();

    // Support both wrapped { success, data } and raw responses
    if (json && typeof json === 'object' && 'success' in json && 'data' in json && json.success === true) {
      return json.data as T;
    }

    return json as T;
  } catch (error) {
    console.error(`[API Request Error] ${url}:`, error);
    throw error;
  }
}

// REST shorthand methods
export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data: any, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: 'POST', data }),

  put: <T>(url: string, data: any, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: 'PUT', data }),

  delete: <T>(url: string, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
};
