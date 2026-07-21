'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCategory } from '@/services/categories';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError('Name and slug are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createCategory({ name, slug });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <div className="mb-6">
        <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition">
          &larr; Back to Articles
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200/80 shadow-2xs">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Create Topic / Category</h1>

        {error && (
          <div className="mb-5 p-3 bg-gray-50 text-gray-900 text-xs font-medium rounded-lg border border-gray-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Topic Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="input-field"
              placeholder="e.g. System Design, DevOps, Golang"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Topic Slug
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="input-field bg-gray-50 font-mono text-xs"
              placeholder="e.g. system-design"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Link href="/" className="btn-secondary text-xs">
              Cancel
            </Link>
            <button type="submit" className="btn-primary text-xs" disabled={loading}>
              {loading ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
