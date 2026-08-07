import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/common/FilterBar.jsx';
import Pagination from '../components/common/Pagination.jsx';
import PostCard from '../components/posts/PostCard.jsx';
import { fetchCategories, fetchPosts, fetchTags } from '../services/api.js';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedPosts, fetchedCategories, fetchedTags] = await Promise.all([
        fetchPosts({ search: searchQuery, categoryId: selectedCategory, status: 'PUBLISHED' }),
        fetchCategories(),
        fetchTags(),
      ]);

      setPosts(fetchedPosts);
      setCategories(fetchedCategories);
      setTags(fetchedTags);
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const handleLikeEvent = (e) => {
      const { postId, likesCount } = e.detail || {};
      if (!postId || typeof likesCount !== 'number') return;
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, _count: { ...p._count, likes: likesCount } } : p))
      );
    };

    const handleBookmarkEvent = (e) => {
      const { postId, isBookmarked } = e.detail || {};
      if (!postId || typeof isBookmarked !== 'boolean') return;
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const current = p._count?.bookmarks ?? 0;
          return { ...p, _count: { ...p._count, bookmarks: Math.max(0, current + (isBookmarked ? 1 : -1)) } };
        })
      );
    };

    const handleCommentEvent = (e) => {
      const { postId, commentsCountDelta } = e.detail || {};
      if (!postId || typeof commentsCountDelta !== 'number') return;
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const current = p._count?.comments ?? 0;
          return { ...p, _count: { ...p._count, comments: Math.max(0, current + commentsCountDelta) } };
        })
      );
    };

    window.addEventListener('post-like-updated', handleLikeEvent);
    window.addEventListener('post-bookmark-updated', handleBookmarkEvent);
    window.addEventListener('post-comment-updated', handleCommentEvent);

    return () => {
      window.removeEventListener('post-like-updated', handleLikeEvent);
      window.removeEventListener('post-bookmark-updated', handleBookmarkEvent);
      window.removeEventListener('post-comment-updated', handleCommentEvent);
    };
  }, []);

  // Client-side Sort
  const sortedPosts = [...posts].sort((a, b) => {
    if (selectedSort === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (selectedSort === 'views') {
      return (b.viewsCount || 0) - (a.viewsCount || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Pagination Math
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  const featuredPost = sortedPosts[0];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span>✨ BlogCraft Content Management Platform</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Discover Articles, Technical Insights & <span className="gradient-text">Stories</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore curated articles with category hierarchy, tag organization, reading time calculation, and real-time search.
          </p>
        </div>
      </section>

      {/* Featured Article Banner */}
      {!loading && featuredPost && !searchQuery && !selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl overflow-hidden p-6 md:p-8 border border-indigo-500/20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={featuredPost.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80'}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Featured
                </span>
                {featuredPost.category && (
                  <span className="text-xs text-slate-400 font-medium">in {featuredPost.category.name}</span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 hover:text-indigo-400 transition-colors">
                <Link to={`/posts/${featuredPost.id}`}>{featuredPost.title}</Link>
              </h2>
              <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                {featuredPost.excerpt || featuredPost.content?.slice(0, 160) + '...'}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={`/posts/${featuredPost.id}`}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
                >
                  Read Full Article →
                </Link>

                <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-800">
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold" title="Likes">
                    <svg className="w-4.5 h-4.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {featuredPost._count?.likes ?? 0}
                  </span>

                  <Link
                    to={`/posts/${featuredPost.id}#comments`}
                    className="flex items-center gap-1.5 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group/fcmt"
                    title="Click to view and add comments"
                  >
                    <svg className="w-4.5 h-4.5 text-indigo-400 group-hover/fcmt:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                    <span>{featuredPost._count?.comments ?? 0}</span>
                  </Link>

                  <span className="flex items-center gap-1.5 text-amber-400 font-bold" title="Bookmarks">
                    <svg className="w-4.5 h-4.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                    </svg>
                    {featuredPost._count?.bookmarks ?? 0}
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-300 font-bold" title="Views">
                    <svg className="w-4.5 h-4.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {featuredPost.viewsCount ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          onResetFilters={handleReset}
        />

        {/* Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Posts Grid Column */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass-card rounded-2xl h-80 animate-pulse bg-slate-900/50" />
                ))}
              </div>
            ) : paginatedPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            ) : (
              <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-200">No articles found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your search query or reset filters.</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Categories widget */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Categories</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !selectedCategory ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full">{posts.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(cat.id || cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === (cat.id || cat.name)
                        ? 'bg-indigo-500/20 text-indigo-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full">
                      {posts.filter((p) => p.categoryId === cat.id || p.category?.name === cat.name).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Cloud widget */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Popular Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <button
                    key={tag.id || tag.name}
                    onClick={() => setSearchQuery(tag.name)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800 hover:border-indigo-500/40 hover:text-indigo-300 transition-colors"
                  >
                    #{tag.name}
                  </button>
                ))}
                {tags.length === 0 && <p className="text-xs text-slate-500">No tags registered yet.</p>}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
