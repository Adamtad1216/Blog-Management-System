import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  addBookmark,
  getPostLikes,
  getUserBookmarks,
  likePost,
  removeBookmark,
  unlikePost,
} from '../../services/api.js';
import { calculateReadingTime } from '../../utils/readingTime.js';

export default function PostCard({ post, showActions = false, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    id,
    title,
    excerpt,
    content,
    featuredImage,
    status,
    createdAt,
    author,
    category,
  } = post;

  const [likesCount, setLikesCount] = useState(post._count?.likes ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const readingTime = calculateReadingTime(content || excerpt || '');
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const defaultImage =
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  const [commentsCount, setCommentsCount] = useState(post._count?.comments ?? 0);
  const [bookmarksCount, setBookmarksCount] = useState(post._count?.bookmarks ?? 0);

  useEffect(() => {
    setCommentsCount(post._count?.comments ?? 0);
    setBookmarksCount(post._count?.bookmarks ?? 0);
  }, [post._count?.comments, post._count?.bookmarks]);

  useEffect(() => {
    if (!id) return;
    getPostLikes(id)
      .then((data) => {
        setLikesCount(data?.data?.likesCount ?? data?.likesCount ?? (post._count?.likes ?? 0));
        setIsLiked(data?.data?.isLiked ?? data?.isLiked ?? false);
      })
      .catch(() => {});

    if (user) {
      getUserBookmarks()
        .then((userBookmarks) => {
          const bookmarked = userBookmarks.some((p) => p.id === id);
          setIsBookmarked(bookmarked);
        })
        .catch(() => {});
    }
  }, [id, user, post._count?.likes]);

  useEffect(() => {
    const handleLikeEvent = (e) => {
      if (e.detail?.postId === id) {
        if (typeof e.detail.likesCount === 'number') {
          setLikesCount(e.detail.likesCount);
        }
        if (typeof e.detail.isLiked === 'boolean') {
          setIsLiked(e.detail.isLiked);
        }
      }
    };

    const handleBookmarkEvent = (e) => {
      if (e.detail?.postId === id) {
        if (typeof e.detail.isBookmarked === 'boolean') {
          setIsBookmarked(e.detail.isBookmarked);
          setBookmarksCount((prev) => Math.max(0, prev + (e.detail.isBookmarked ? 1 : -1)));
        }
      }
    };

    const handleCommentEvent = (e) => {
      if (e.detail?.postId === id) {
        if (typeof e.detail.commentsCountDelta === 'number') {
          setCommentsCount((prev) => Math.max(0, prev + e.detail.commentsCountDelta));
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
  }, [id]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to like posts.');
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = isLiked ? await unlikePost(id) : await likePost(id);
      const data = res?.data || res;
      const nextIsLiked = data?.isLiked ?? !isLiked;
      const nextCount = data?.likesCount ?? (nextIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1));

      setLikesCount(nextCount);
      setIsLiked(nextIsLiked);

      window.dispatchEvent(
        new CustomEvent('post-like-updated', {
          detail: { postId: id, isLiked: nextIsLiked, likesCount: nextCount },
        })
      );
    } catch (err) {
      console.error('Like action failed:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark posts.');
      return;
    }
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(id);
        setIsBookmarked(false);
        window.dispatchEvent(
          new CustomEvent('post-bookmark-updated', {
            detail: { postId: id, isBookmarked: false, post },
          })
        );
      } else {
        await addBookmark(id);
        setIsBookmarked(true);
        window.dispatchEvent(
          new CustomEvent('post-bookmark-updated', {
            detail: { postId: id, isBookmarked: true, post },
          })
        );
      }
    } catch (err) {
      console.error('Bookmark action failed:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/posts/${id}#comments`);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/posts/${id}`);
  };

  const authorName = author?.fullName || author?.username || 'Author';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article
      onClick={handleCardClick}
      className="bg-[#0f172a] rounded-[24px] border border-slate-800/80 hover:border-slate-700/80 hover:shadow-xl transition-all duration-300 flex flex-col group h-full shadow-lg overflow-hidden cursor-pointer"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={featuredImage || defaultImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />

        {/* Category Pill Tag Overlay (Top Left as in Screenshot) */}
        {category && (
          <Link
            to={`/categories/${category.slug || category.name}`}
            className="absolute top-3.5 left-3.5 bg-slate-950/85 backdrop-blur-md text-slate-200 text-xs font-semibold px-3 py-1 rounded-full border border-slate-800/60 hover:bg-slate-900 hover:text-indigo-400 transition-colors z-10"
          >
            {category.name}
          </Link>
        )}

        {status && (
          <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            {status}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Article Title */}
          <Link to={`/posts/${id}`} className="block group-hover:text-indigo-400 transition-colors mb-2">
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-100 line-clamp-2 leading-snug tracking-tight">
              {title}
            </h3>
          </Link>

          {/* Article Excerpt */}
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
            {excerpt || (content ? content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : 'No summary available.')}
          </p>

          {/* Author Info Row */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex-shrink-0">
              {author?.avatar ? (
                <img src={author.avatar} alt={authorName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-xs text-indigo-300">
                  {authorInitial}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 truncate">{authorName}</p>
              <p className="text-xs text-slate-400 truncate">
                {formattedDate} {readingTime ? `· ${readingTime}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/80 my-4" />

        {/* Action Icon Footer Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like / Unlike Button */}
            <button
              onClick={handleLike}
              disabled={likeLoading}
              title={isLiked ? 'Unlike' : 'Like'}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50 group/like"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isLiked ? '#f43f5e' : 'none'}
                stroke={isLiked ? '#f43f5e' : 'currentColor'}
                strokeWidth={2}
                className="w-4 h-4 group-hover/like:scale-110 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span className={`text-xs font-semibold ${isLiked ? 'text-rose-400' : 'text-slate-300'}`}>
                {likesCount}
              </span>
            </button>

            {/* Comment Button (Clickable -> Opens post and scrolls to comment section) */}
            <button
              onClick={handleCommentClick}
              title="Comments"
              className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer group/cmt"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 group-hover/cmt:scale-110 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <span className="text-xs font-semibold text-slate-300">
                {commentsCount}
              </span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
            className="flex items-center text-slate-400 hover:text-amber-400 transition-colors cursor-pointer disabled:opacity-50 group/bm flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isBookmarked ? '#f59e0b' : 'none'}
              stroke={isBookmarked ? '#f59e0b' : 'currentColor'}
              strokeWidth={2}
              className="w-4 h-4 group-hover/bm:scale-110 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          </button>
        </div>

        {/* Optional Dashboard Edit/Delete Actions */}
        {showActions && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
            <Link
              to={`/edit/${id}`}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete && onDelete(id)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
