import { getToken } from './auth';

const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side rendering (SSR)
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }
  // Client-side in browser: use /api proxy to avoid CORS or direct backend if env provided
  return '/api';
};

export async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}
