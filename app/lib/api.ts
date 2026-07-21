import { ApiResponse, Blog, Category } from '../types';
import { getToken } from './auth';

const API_BASE = '/api';

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

// === Auth API ===
export async function registerUser(data: { username: string; email: string; password: string }): Promise<ApiResponse> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: { username: string; password: string }): Promise<ApiResponse> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// === Blogs API ===
export async function fetchBlogs(): Promise<{ blogs: Blog[]; message: string }> {
  return request('/blogs');
}

export async function fetchMyBlogs(): Promise<{ blogs: Blog[]; message: string }> {
  return request('/blogs/user');
}

export async function fetchBlog(id: string | number): Promise<{ blog: Blog; message: string }> {
  return request(`/blogs/${id}`);
}

export async function createBlog(data: { title: string; content: string; category_id?: number | null }): Promise<{ blog: Blog; message: string }> {
  return request('/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBlog(
  id: string | number,
  data: { title?: string; content?: string; category_id?: number | null }
): Promise<{ blog: Blog; message: string }> {
  return request(`/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBlog(id: string | number): Promise<{ blog: Blog; message: string }> {
  return request(`/blogs/${id}`, {
    method: 'DELETE',
  });
}

// === Categories API ===
export async function fetchCategories(): Promise<{ categories: Category[]; message: string }> {
  return request('/categories');
}

export async function createCategory(data: { name: string; slug: string }): Promise<{ category: Category; message: string }> {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
