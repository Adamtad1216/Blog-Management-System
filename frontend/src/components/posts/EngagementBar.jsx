import { useEffect, useState } from 'react';
import {
  addBookmark,
  getPostLikes,
  getUserBookmarks,
  likePost,
  removeBookmark,
  unlikePost,
} from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function EngagementBar({ postId, commentCount = 0, onCommentClick }) {
  const { user } = useAuth();

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [bookmarkAnim, setBookmarkAnim] = useState(false);

  const [internalCommentCount, setInternalCommentCount] = useState(commentCount);

  useEffect(() => {
    setInternalCommentCount(commentCount);
  }, [commentCount]);

  useEffect(() => {
    if (!postId) return;
    getPostLikes(postId)
      .then((data) => {
        setLikesCount(data?.data?.likesCount ?? data?.likesCount ?? 0);
        setIsLiked(data?.data?.isLiked ?? data?.isLiked ?? false);
      })
      .catch(() => {});

    if (user) {
      getUserBookmarks()
        .then((userBookmarks) => {
          const bookmarked = userBookmarks.some((p) => p.id === postId);
          setIsBookmarked(bookmarked);
        })
        .catch(() => {});
    }
  }, [postId, user]);

  useEffect(() => {
    const handleLikeEvent = (e) => {
      if (e.detail?.postId === postId) {
        if (typeof e.detail.likesCount === 'number') {
          setLikesCount(e.detail.likesCount);
        }
        if (typeof e.detail.isLiked === 'boolean') {
          setIsLiked(e.detail.isLiked);
        }
      }
    };

    const handleBookmarkEvent = (e) => {
      if (e.detail?.postId === postId) {
        if (typeof e.detail.isBookmarked === 'boolean') {
          setIsBookmarked(e.detail.isBookmarked);
        }
      }
    };

    const handleCommentEvent = (e) => {
      if (e.detail?.postId === postId) {
        if (typeof e.detail.commentsCountDelta === 'number') {
          setInternalCommentCount((prev) => Math.max(0, prev + e.detail.commentsCountDelta));
        }
      }
    };

    window.addEventListener('post-like-updated', handleLikeEvent);
    window.addEventListener('post-bookmark-updated', handleBookmarkEvent);
    window.addEventListener('post-comment-updated', handleCommentEvent);

    return () => {
      window.removeEventListener('post-like-updated', handleLikeEvent);
      window.removeEventListener('post-bookmark-updated', handleBookmarkEvent);
      window.removeEventListener('post-comment-updated', handleCommentEvent);
    };
  }, [postId]);

  const handleLike = async () => {
    if (!user) { alert('Please log in to like posts.'); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = isLiked ? await unlikePost(postId) : await likePost(postId);
      const data = res?.data || res;
      const nextIsLiked = data?.isLiked ?? !isLiked;
      const nextCount = data?.likesCount ?? (nextIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1));

      setLikesCount(nextCount);
      setIsLiked(nextIsLiked);
      if (nextIsLiked) {
        setLikeAnim(true);
        setTimeout(() => setLikeAnim(false), 600);
      }

      window.dispatchEvent(
        new CustomEvent('post-like-updated', {
          detail: { postId, isLiked: nextIsLiked, likesCount: nextCount },
        })
      );
    } catch {
      /* ignore */
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) { alert('Please log in to bookmark posts.'); return; }
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(postId);
        setIsBookmarked(false);
        window.dispatchEvent(
          new CustomEvent('post-bookmark-updated', {
            detail: { postId, isBookmarked: false },
          })
        );
      } else {
        await addBookmark(postId);
        setIsBookmarked(true);
        setBookmarkAnim(true);
        setTimeout(() => setBookmarkAnim(false), 600);
        window.dispatchEvent(
          new CustomEvent('post-bookmark-updated', {
            detail: { postId, isBookmarked: true },
          })
        );
      }
    } catch {
      /* ignore */
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* ── Like Button ── */}
      <button
        onClick={handleLike}
        disabled={likeLoading}
        title={isLiked ? 'Unlike' : 'Like this post'}
        className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 select-none
          ${isLiked
            ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-rose-500/40 hover:text-rose-400 hover:bg-rose-500/10'
          } disabled:opacity-50`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          className={`w-4 h-4 transition-transform duration-300 ${likeAnim ? 'scale-125' : 'scale-100'}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span>{likesCount}</span>
        <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
      </button>

      {/* ── Comment Button ── */}
      <button
        onClick={onCommentClick}
        title="Jump to comments"
        className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border bg-slate-900 border-slate-700 text-slate-400 hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 select-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
        <span>{commentCount}</span>
        <span className="hidden sm:inline">Comments</span>
      </button>

      {/* ── Bookmark Button ── */}
      <button
        onClick={handleBookmark}
        disabled={bookmarkLoading}
        title={isBookmarked ? 'Remove bookmark' : 'Save post'}
        className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 select-none ml-auto
          ${isBookmarked
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/10'
          } disabled:opacity-50`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          className={`w-4 h-4 transition-transform duration-300 ${bookmarkAnim ? 'scale-125' : 'scale-100'}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
        <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
      </button>
    </div>
  );
}
