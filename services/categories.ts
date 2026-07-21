import { request } from './api';
import { Category } from '../types';

export async function getAllCategories(): Promise<{ categories: Category[]; message: string }> {
  return request('/categories');
}

export async function getCategoryById(id: string | number): Promise<{ category: Category; message: string }> {
  return request(`/categories/${id}`);
}

export async function createCategory(data: { name: string; slug: string }): Promise<{ category: Category; message: string }> {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string | number,
  data: { name?: string; slug?: string }
): Promise<{ category: Category; message: string }> {
  return request(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string | number): Promise<{ category: Category; message: string }> {
  return request(`/categories/${id}`, {
    method: 'DELETE',
  });
}
