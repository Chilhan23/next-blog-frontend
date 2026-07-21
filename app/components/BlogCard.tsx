'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Blog } from '../types';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const preview = blog.content.length > 130
    ? blog.content.substring(0, 130) + '...'
    : blog.content;

  const date = new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const words = blog.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const authorInitial = (blog.author_name || 'A').charAt(0).toUpperCase();

  return (
    <Link href={`/blogs/${blog.id}`} className="block group">
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.18, ease: 'easeOut' } }}
        whileTap={{ scale: 0.99 }}
        className="card p-5 h-full flex flex-col justify-between relative overflow-hidden bg-white border border-gray-200/80 hover:border-gray-400 hover:shadow-md transition-shadow duration-200 rounded-xl"
      >
        <div>
          {/* Header Meta: Category & Date */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {blog.category_name ? (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                {blog.category_name}
              </span>
            ) : (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-gray-50 text-gray-400">
                General
              </span>
            )}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <span>{date}</span>
              <span>•</span>
              <span>{readTime}m read</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-black transition-colors duration-150">
            {blog.title}
          </h2>

          {/* Content preview */}
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-5 font-normal">
            {preview}
          </p>
        </div>

        {/* Footer: Author & Likes Counter */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[9px]">
              {authorInitial}
            </div>
            <span className="text-xs font-medium text-gray-700">
              {blog.author_name || 'Anonymous'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium">
              <svg className="w-3 h-3 fill-gray-700" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{blog.total_likes || 0}</span>
            </div>

            <motion.span
              whileHover={{ x: 2 }}
              className="text-xs font-medium text-gray-900 transition-transform duration-150"
            >
              &rarr;
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
