import { request } from './api';
import { ApiResponse, User } from '../types';

const TOKEN_KEY = 'jwt_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getCurrentUser(): User | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const decoded = JSON.parse(atob(payloadBase64));

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      removeToken();
      return null;
    }

    return {
      id: decoded.user_id || '',
      username: decoded.username || '',
      email: decoded.email || '',
      role: decoded.role || 'user',
    };
  } catch (e) {
    return null;
  }
}

export async function register(data: { username: string; email: string; password: string }): Promise<ApiResponse> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: { username: string; password: string }): Promise<ApiResponse> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
