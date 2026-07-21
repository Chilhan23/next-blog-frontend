'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '../../services/auth';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({ username, email, password });
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
          <h1 className="text-xl font-black text-gray-900 mb-1">Create Account</h1>
          <p className="text-xs text-gray-500 font-normal">Join TechPulse to write & comment</p>
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
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] font-mono font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@example.com"
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
              placeholder="At least 6 characters"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-gray-900 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
