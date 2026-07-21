import { request } from './api';
import { Blog, LikeResponse } from '../types';

export async function getAllBlogs(): Promise<{ blogs: Blog[]; message: string }> {
  return request('/blogs');
}

export async function getUserBlogs(): Promise<{ blogs: Blog[]; message: string }> {
  return request('/blogs/user');
}

export async function getBlogById(id: string | number): Promise<{ blog: Blog; message: string }> {
  return request(`/blogs/${id}`);
}

export async function createBlog(data: {
  title: string;
  content: string;
  category_id?: number | null;
}): Promise<{ blog: Blog; message: string }> {
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

export async function toggleLikeBlog(id: string | number): Promise<LikeResponse> {
  return request(`/blogs/${id}/like`, {
    method: 'POST',
  });
}
