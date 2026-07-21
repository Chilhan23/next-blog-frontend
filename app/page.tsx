'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBlogs } from '../services/blogs';
import { getAllCategories } from '../services/categories';
import BlogCard from './components/BlogCard';
import CategoryFilter from './components/CategoryFilter';
import { Blog, Category } from '../types';
import Link from 'next/link';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [blogRes, catRes] = await Promise.all([
          getAllBlogs(),
          getAllCategories().catch(() => ({ categories: [] })),
        ]);
        setBlogs(blogRes.blogs || []);
        setCategories(catRes.categories || []);
      } catch (e: any) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBlogs = selectedCategoryId
    ? blogs.filter((b) => b.category_id === selectedCategoryId)
    : blogs;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-10 py-4"
    >
      {/* Inclusive Open Platform Hero Section */}
      <section className="text-center max-w-2xl mx-auto py-10 px-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 font-mono text-[11px] font-medium shadow-2xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
          <span>Open Blogging Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 leading-[1.15]"
        >
          Suarakan Gagasan, Cerita & Pemikiranmu Tanpa Batas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto font-normal leading-relaxed"
        >
          Wadah blog terbuka untuk siapa saja. Bebas berekspresi, menulis artikel, berbagi pengalaman, dan menginspirasi siapa saja.
        </motion.p>
      </section>

      {/* Main Feed */}
      <div>
        {/* Category Pills Filter */}
        {!loading && categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
          />
        )}

        {/* Blog Cards Grid with Silky Smooth AnimatePresence */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 h-48 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-gray-50 text-gray-800 p-6 rounded-xl text-center border border-gray-200 max-w-md mx-auto shadow-2xs">
            <p className="font-semibold text-sm mb-1">Could not connect to API</p>
            <p className="text-xs text-gray-500 font-normal">{error}</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-xl border border-gray-200/80 max-w-md mx-auto space-y-4"
          >
            <p className="text-gray-500 font-medium text-xs">
              Belum ada artikel di topik ini.
            </p>
            <Link href="/blogs/create" className="btn-primary text-xs">
              Tulis Artikel Pertama
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategoryId ?? 'all'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
