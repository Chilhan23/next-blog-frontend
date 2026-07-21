'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBlog } from '@/services/blogs';
import { getAllCategories } from '@/services/categories';
import { Category } from '@/types';

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getAllCategories();
        setCategories(res.categories || []);
      } catch (e) {
        // Ignored
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createBlog({
        title,
        content,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
      });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create blog post');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition">
          &larr; Back to Articles
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200/80 shadow-2xs">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Write New Article</h1>

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
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Topic / Category (Optional)
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select a Topic</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Content (Markdown supported)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="input-field resize-y"
              placeholder="Write your article content here..."
              disabled={loading}
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Link href="/" className="btn-secondary text-xs">
              Cancel
            </Link>
            <button type="submit" className="btn-primary text-xs" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
