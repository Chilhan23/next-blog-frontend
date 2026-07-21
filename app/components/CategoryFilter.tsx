'use client';

import { motion } from 'framer-motion';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => onSelectCategory(null)}
        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
          selectedCategoryId === null
            ? 'bg-[#111111] text-white shadow-xs'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80'
        }`}
      >
        Semua Artikel
      </motion.button>

      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
            selectedCategoryId === cat.id
              ? 'bg-[#111111] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80'
          }`}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
}
