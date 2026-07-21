'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getBlogById, deleteBlog, toggleLikeBlog } from '@/services/blogs';
import { getCurrentUser } from '@/services/auth';
import { Blog, User } from '@/types';
import Modal from '@/app/components/Modal';
import CommentSection from '@/app/components/CommentSection';

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [liking, setLiking] = useState<boolean>(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());

    async function loadBlog() {
      try {
        const data = await getBlogById(id);
        setBlog(data.blog);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadBlog();
    }
  }, [id]);

  const handleToggleLike = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (!blog || liking) return;

    setLiking(true);
    try {
      const res = await toggleLikeBlog(id);
      setBlog((prev) =>
        prev
          ? {
              ...prev,
              is_liked: res.is_liked,
              total_likes: res.total_likes,
            }
          : null
      );
    } catch (err: any) {
      // Optional error handling
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBlog(id);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-8 bg-gray-200 rounded"></div>
        <div className="w-full h-64 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200 max-w-md mx-auto">
        <div className="text-gray-900 font-semibold text-sm mb-4">{error || 'Artikel tidak ditemukan'}</div>
        <Link href="/" className="btn-secondary text-xs">
          &larr; Kembali ke Artikel
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.id === blog.user_id;

  const date = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const words = blog.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-2xl mx-auto py-4"
    >
      <div className="mb-6">
        <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition">
          &larr; Semua Artikel
        </Link>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-xl border border-gray-200/80 shadow-2xs">
        <header className="mb-8 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2 mb-3">
            {blog.category_name && (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                {blog.category_name}
              </span>
            )}
            <span className="text-xs text-gray-400 font-medium">{date}</span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-400 font-medium">{readTime} min read</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-[1.25] tracking-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[9px]">
                  {(blog.author_name || 'A').charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-900">
                  {blog.author_name || 'Anonymous'}
                </span>
              </div>

              {/* Monochrome Like Button with Framer Motion animation */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleToggleLike}
                disabled={liking}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer ${
                  blog.is_liked
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <svg className={`w-3.5 h-3.5 ${blog.is_liked ? 'fill-white' : 'fill-gray-700'}`} viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>{blog.is_liked ? 'Liked' : 'Like'}</span>
                <span className="ml-0.5 bg-gray-200 text-gray-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {blog.total_likes || 0}
                </span>
              </motion.button>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Link href={`/blogs/${blog.id}/edit`} className="btn-secondary py-1 px-3 text-xs">
                  Edit
                </Link>
                <button onClick={() => setIsModalOpen(true)} className="btn-danger py-1 px-3 text-xs">
                  Delete
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-gray max-w-none text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-normal">
          {blog.content}
        </div>

        {/* Comment Section */}
        <CommentSection blogId={blog.id} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Hapus Artikel">
        <p className="text-xs text-gray-600">
          Apakah kamu yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setIsModalOpen(false)} className="btn-secondary py-1.5 px-3" disabled={isDeleting}>
            Batal
          </button>
          <button onClick={handleDelete} className="btn-danger py-1.5 px-3" disabled={isDeleting}>
            {isDeleting ? 'Menghapus...' : 'Konfirmasi Hapus'}
          </button>
        </div>
      </Modal>
    </motion.article>
  );
}
