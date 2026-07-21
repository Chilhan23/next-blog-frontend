import { request } from './api';
import { Comment } from '../types';

export async function getBlogComments(blogId: string | number): Promise<{ comments: Comment[]; message: string }> {
  return request(`/blogs/${blogId}/comments`);
}

export async function createComment(
  blogId: string | number,
  content: string
): Promise<{ comment: Comment; message: string }> {
  return request(`/blogs/${blogId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(commentId: string | number): Promise<{ comment?: Comment; message: string }> {
  return request(`/comments/${commentId}`, {
    method: 'DELETE',
  });
}
