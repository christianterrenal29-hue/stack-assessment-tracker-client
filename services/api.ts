const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL.replace(/\/$/, '')}/api`;

const normalizeApiPath = (endpoint: string) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return normalizedEndpoint.startsWith('/api/')
    ? normalizedEndpoint.replace(/^\/api/, '')
    : normalizedEndpoint;
};

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${normalizeApiPath(endpoint)}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const payload = await response.json();

  if (!response.ok) {
    const error = payload;
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data as T;
  }

  return payload as T;
};

export const get = <T = any>(endpoint: string) =>
  apiCall<T>(endpoint, { method: 'GET' });

export const post = <T = any>(endpoint: string, data: any) =>
  apiCall<T>(endpoint, { method: 'POST', body: JSON.stringify(data) });

export const put = <T = any>(endpoint: string, data: any) =>
  apiCall<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) });

export const patch = <T = any>(endpoint: string, data: any) =>
  apiCall<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) });

export const del = <T = any>(endpoint: string) =>
  apiCall<T>(endpoint, { method: 'DELETE' });
