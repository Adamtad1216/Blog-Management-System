import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryModal from '../components/categories/CategoryModal.jsx';
import PostCard from '../components/posts/PostCard.jsx';
import { deletePost, fetchCategories, fetchPosts, updatePost } from '../services/api.js';

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [fetchedPosts, fetchedCategories] = await Promise.all([
        fetchPosts({ search: searchQuery, status: statusFilter }),
        fetchCategories(),
      ]);
      setPosts(fetchedPosts);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [searchQuery, statusFilter]);

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updatePost(id, { status: newStatus });
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    } catch (err) {
      console.error('Failed to update post status:', err);
      alert('Failed to update status.');
    }
  };

  // Metrics Calculation
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const archivedCount = posts.filter((p) => p.status === 'archived').length;
  const totalViews = posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Developer B — Content Management Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-2">Author & Post Management</h1>
          <p className="text-slate-400 text-sm">Manage drafts, published articles, categories, and post statuses.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            + Add Category
          </button>
          <Link
            to="/create"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            + Create New Post
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total Articles</p>
          <p className="text-2xl font-black text-slate-100">{totalPosts}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-1">
          <p className="text-xs text-emerald-400 font-medium">Published</p>
          <p className="text-2xl font-black text-emerald-400">{publishedCount}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-1">
          <p className="text-xs text-amber-400 font-medium">Drafts</p>
          <p className="text-2xl font-black text-amber-400">{draftCount}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 space-y-1">
          <p className="text-xs text-purple-400 font-medium">Total Views</p>
          <p className="text-2xl font-black text-purple-400">{totalViews}</p>
        </div>
      </div>

      {/* Filter & View Switcher */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-1.5 focus:outline-none focus:border-indigo-500/50"
          />

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Grid Cards
          </button>
        </div>
      </div>

      {/* Main Data View */}
      {loading ? (
        <div className="glass-panel p-8 text-center rounded-2xl animate-pulse text-slate-400 text-sm">
          Loading dashboard content...
        </div>
      ) : posts.length > 0 ? (
        viewMode === 'table' ? (
          /* Table View */
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Article</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Views</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=100&q=80'}
                            alt={post.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                          />
                          <div>
                            <Link to={`/posts/${post.id}`} className="font-bold text-slate-100 hover:text-indigo-400 line-clamp-1">
                              {post.title}
                            </Link>
                            <span className="text-[11px] text-slate-500">
                              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-xs">
                        <span className="font-medium text-slate-300">{post.author?.fullName || 'John Author'}</span>
                      </td>

                      <td className="p-4 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                          {post.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      <td className="p-4 text-xs">
                        <select
                          value={post.status || 'draft'}
                          onChange={(e) => handleStatusChange(post.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-950 focus:outline-none ${
                            post.status === 'published'
                              ? 'text-emerald-400 border-emerald-500/30'
                              : post.status === 'archived'
                              ? 'text-slate-400 border-slate-500/30'
                              : 'text-amber-400 border-amber-500/30'
                          }`}
                        >
                          <option value="draft">DRAFT</option>
                          <option value="published">PUBLISHED</option>
                          <option value="archived">ARCHIVED</option>
                        </select>
                      </td>

                      <td className="p-4 text-xs font-mono text-slate-400">{post.viewsCount || 0}</td>

                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/edit/${post.id}`}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showActions onDelete={handleDeletePost} />
            ))}
          </div>
        )
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <p className="text-slate-300 font-medium">No posts found in dashboard</p>
          <Link to="/create" className="inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white">
            Create First Post
          </Link>
        </div>
      )}

      {/* Category Creation Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={(newCat) => setCategories((prev) => [...prev, newCat])}
      />
    </div>
  );
}
