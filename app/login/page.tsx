'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, setToken } from '../../services/auth';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login({ username, password });
      if (res.token) {
        setToken(res.token);
        window.dispatchEvent(new Event('storage'));
        router.push('/');
        router.refresh();
      } else {
        throw new Error(res.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-16">
      <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-8 h-8 rounded bg-[#111111] text-white flex items-center justify-center font-bold text-xs mx-auto mb-3">
            T
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-xs text-gray-500 font-normal">Sign in to your TechPulse account</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-gray-50 text-gray-900 text-xs font-medium rounded-lg border border-gray-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-gray-900 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
