import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchPostById, fetchPosts } from '../services/api.js';
import { calculateReadingTime } from '../utils/readingTime.js';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchedRef = useRef('');

  useEffect(() => {
    if (!id || fetchedRef.current === id) return;
    fetchedRef.current = id;

    const loadPost = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchPostById(id);
        setPost(data);

        // Fetch related posts from same category or general posts
        if (data) {
          const allPosts = await fetchPosts({ categoryId: data.categoryId, status: 'published' });
          setRelatedPosts(allPosts.filter((p) => p.id !== id).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading article details...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-200">Post Not Found</h2>
        <p className="text-slate-400 text-sm">{error || "The article you're looking for doesn't exist."}</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
        >
          ← Return to Home
        </button>
      </div>
    );
  }

  const {
    title,
    excerpt,
    content,
    featuredImage,
    viewsCount,
    createdAt,
    author,
    category,
    tags = [],
  } = post;

  const readingTime = calculateReadingTime(content || excerpt || '');
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Navigation Top */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        ← Back
      </button>

      {/* Header Info */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {category && (
            <Link
              to={`/categories/${category.slug || category.name}`}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
            >
              {category.name}
            </Link>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{readingTime}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {viewsCount} views
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 leading-tight tracking-tight">{title}</h1>

        {/* Author Info Banner */}
        {author && (
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
              {author.avatar ? (
                <img src={author.avatar} alt={author.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-xs text-indigo-300">
                  {author.fullName?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">{author.fullName}</p>
              <p className="text-xs text-slate-400">@{author.username || 'author'} • {author.role || 'Author'}</p>
            </div>
          </div>
        )}
      </header>

      {/* Featured Cover Image */}
      {featuredImage && (
        <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
          <img src={featuredImage} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Excerpt Box */}
      {excerpt && (
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-indigo-500 text-slate-300 italic text-sm leading-relaxed">
          "{excerpt}"
        </div>
      )}

      {/* Main Body Article */}
      <div className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
        {content}
      </div>

      {/* Tag Badges Footer */}
      {tags.length > 0 && (
        <div className="pt-6 border-t border-slate-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-2">Tags:</span>
          {tags.map((item) => {
            const tag = item.tag || item;
            return (
              <span
                key={tag.id || tag.name}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800"
              >
                #{tag.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="pt-12 border-t border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-slate-100">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((relPost) => (
              <div key={relPost.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-indigo-400 font-semibold">{relPost.category?.name}</span>
                <h4 className="font-bold text-slate-100 line-clamp-2 hover:text-indigo-400">
                  <Link to={`/posts/${relPost.id}`}>{relPost.title}</Link>
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">{relPost.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
