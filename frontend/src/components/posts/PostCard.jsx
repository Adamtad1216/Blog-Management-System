import { Link } from 'react-router-dom';
import { calculateReadingTime } from '../../utils/readingTime.js';

export default function PostCard({ post, showActions = false, onDelete }) {
  const {
    id,
    title,
    excerpt,
    content,
    featuredImage,
    status,
    viewsCount = 0,
    createdAt,
    author,
    category,
    tags = [],
  } = post;

  const readingTime = calculateReadingTime(content || excerpt || '');
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  const statusColors = {
    published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    PUBLISHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    draft: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    DRAFT: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    archived: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    ARCHIVED: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  return (
    <article className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Cover Image Header */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src={featuredImage || defaultImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {category && (
            <Link
              to={`/categories/${category.slug || category.name}`}
              className="pointer-events-auto px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 transition-colors"
            >
              {category.name}
            </Link>
          )}

          {status && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                statusColors[status] || statusColors.draft
              }`}
            >
              {status.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tag Badges */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tags.slice(0, 3).map((item) => {
                const tag = item.tag || item;
                return (
                  <span key={tag.id || tag.name} className="text-[11px] text-slate-400 font-medium">
                    #{tag.name}
                  </span>
                );
              })}
            </div>
          )}

          {/* Title */}
          <Link to={`/posts/${id}`} className="block group-hover:text-indigo-400 transition-colors mb-2">
            <h3 className="font-bold text-lg text-slate-100 line-clamp-2 leading-snug">{title}</h3>
          </Link>

          {/* Excerpt */}
          <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
            {excerpt || (content ? content.replace(/<[^>]*>/g, '').slice(0, 140) + '...' : 'No summary provided.')}
          </p>
        </div>

        {/* Card Footer Meta */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 flex-shrink-0">
              {author?.avatar ? (
                <img src={author.avatar} alt={author.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-[10px] text-indigo-300">
                  {author?.fullName?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            <span className="font-medium text-slate-300 truncate max-w-[100px]">{author?.fullName || 'Author'}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            {/* Reading Time */}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime}
            </span>

            {/* Views Count */}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {viewsCount}
            </span>
          </div>
        </div>

        {/* Dashboard Management Quick Actions */}
        {showActions && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <Link
              to={`/edit/${id}`}
              className="px-3 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete && onDelete(id)}
              className="px-3 py-1 rounded-md text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
