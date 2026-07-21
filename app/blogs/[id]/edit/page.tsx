'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getBlogById, updateBlog } from '@/services/blogs';
import { getAllCategories } from '@/services/categories';
import { Category } from '@/types';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const [blogRes, catRes] = await Promise.all([
          getBlogById(id),
          getAllCategories().catch(() => ({ categories: [] })),
        ]);
        setTitle(blogRes.blog.title);
        setContent(blogRes.blog.content);
        setCategoryId(blogRes.blog.category_id ? String(blogRes.blog.category_id) : '');
        setCategories(catRes.categories || []);
      } catch (err: any) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadData();
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await updateBlog(id, {
        title,
        content,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
      });
      router.push(`/blogs/${id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4 animate-pulse">
        <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-10 bg-gray-200 rounded"></div>
        <div className="w-full h-48 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link href={`/blogs/${id}`} className="text-xs font-medium text-gray-500 hover:text-gray-900 transition">
          &larr; Back to Article
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200/80 shadow-2xs">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Article</h1>

        {error && (
          <div className="mb-5 p-3 bg-gray-50 text-gray-900 text-xs font-medium rounded-lg border border-gray-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Article title"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Topic / Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
              disabled={submitting}
            >
              <option value="">No Topic</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="input-field resize-y"
              placeholder="Write your article content here..."
              disabled={submitting}
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Link href={`/blogs/${id}`} className="btn-secondary text-xs">
              Cancel
            </Link>
            <button type="submit" className="btn-primary text-xs" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
