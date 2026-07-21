'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, removeToken } from '../../services/auth';
import { User } from '../../types';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = () => {
    setUser(getCurrentUser());
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Brand Logo (Linear/Vercel Style) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-[#111111] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs transition-transform duration-200 group-hover:scale-105">
            T
          </div>
          <span className="text-sm font-bold text-gray-900 tracking-tight group-hover:text-black transition-colors">
            TechPulse
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/"
            className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100/60 transition duration-150 hidden sm:inline-block"
          >
            Articles
          </Link>

          {user ? (
            <>
              <Link
                href="/blogs/my"
                className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100/60 transition duration-150 hidden sm:inline-block"
              >
                My Posts
              </Link>

              {isAdmin && (
                <Link href="/categories/create" className="btn-secondary py-1.5 px-3">
                  + Category
                </Link>
              )}

              <Link href="/blogs/create" className="btn-primary py-1.5 px-3">
                + Write Post
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-full text-xs font-medium text-gray-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  <span>{user.username}</span>
                  {isAdmin && (
                    <span className="text-[10px] text-gray-500 uppercase font-mono ml-0.5">
                      (Admin)
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-black px-2 py-1 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary py-1.5 px-3">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary py-1.5 px-3">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
