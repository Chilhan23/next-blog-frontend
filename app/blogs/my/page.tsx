'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserBlogs } from '@/services/blogs';
import { getCurrentUser } from '@/services/auth';
import { Blog, User } from '@/types';
import BlogCard from '@/app/components/BlogCard';
import Link from 'next/link';

export default function MyBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    async function loadMyBlogs() {
      try {
        const res = await getUserBlogs();
        setBlogs(res.blogs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load your posts');
      } finally {
        setLoading(false);
      }
    }
    loadMyBlogs();
  }, [router]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-gray-50 border border-gray-200 rounded-xl p-5 h-48 animate-pulse flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
            </div>
            <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Articles</h1>
          <p className="text-xs text-gray-500 mt-1">
            Author dashboard for <span className="font-semibold text-gray-900">{user?.username}</span>
          </p>
        </div>
        <Link href="/blogs/create" className="btn-primary text-xs">
          + Write New Article
        </Link>
      </div>

      {error ? (
        <div className="bg-gray-50 text-gray-800 p-4 rounded-xl text-center border border-gray-200 text-xs">
          {error}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200/80 max-w-md mx-auto space-y-4">
          <p className="text-gray-500 font-medium text-xs">You haven't written any articles yet.</p>
          <Link href="/blogs/create" className="btn-primary text-xs">
            Write your first article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
