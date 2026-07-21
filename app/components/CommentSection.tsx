'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { getBlogComments, createComment, deleteComment } from '@/services/comments';
import { getCurrentUser } from '@/services/auth';
import { Comment, User } from '@/types';

interface CommentSectionProps {
  blogId: number | string;
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setCurrentUser(getCurrentUser());

    async function loadComments() {
      try {
        setLoading(true);
        const res = await getBlogComments(blogId);
        setComments(res.comments || []);
      } catch (e) {
        // Ignored
      } finally {
        setLoading(false);
      }
    }

    if (blogId) {
      loadComments();
    }
  }, [blogId]);

  const handleCreateComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!currentUser) {
      setError('Please login to post a comment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await createComment(blogId, content);
      if (res.comment) {
        const newComment = {
          ...res.comment,
          user_name: currentUser.username,
        };
        setComments((prev) => [...prev, newComment]);
        setContent('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span>Discussion</span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono font-medium border border-gray-200">
            {comments.length}
          </span>
        </h3>
      </div>

      {/* Write Comment Form */}
      {currentUser ? (
        <form onSubmit={handleCreateComment} className="mb-8 space-y-3">
          {error && (
            <div className="p-3 bg-gray-50 text-gray-800 text-xs font-medium rounded-lg border border-gray-200">
              {error}
            </div>
          )}

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="input-field resize-y"
              placeholder="Add to the discussion..."
              disabled={submitting}
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary py-1.5 px-3 text-xs" disabled={submitting || !content.trim()}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200/80 text-center">
          <p className="text-xs text-gray-500 font-normal">
            Want to participate?{' '}
            <Link href="/login" className="text-gray-900 font-bold hover:underline">
              Sign in
            </Link>{' '}
            to comment.
          </p>
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-16 bg-gray-50 border border-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-16 bg-gray-50 border border-gray-200 rounded-lg animate-pulse"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center py-6 text-xs text-gray-400 font-normal">
          No comments yet. Be the first to start the conversation!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => {
            const canDelete =
              currentUser && (currentUser.id === c.user_id || currentUser.role === 'admin');

            const date = new Date(c.created_at || Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={c.id}
                className="p-4 bg-gray-50/50 rounded-lg border border-gray-200/80 space-y-1.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[9px]">
                      {(c.user_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {c.user_name || 'Anonymous'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal ml-1">{date}</span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-xs font-medium text-gray-400 hover:text-black transition px-2 py-0.5 rounded hover:bg-gray-100 cursor-pointer"
                      title="Delete Comment"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-normal pt-1">
                  {c.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
