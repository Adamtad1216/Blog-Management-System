import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CategoryDeleteModal from '../components/categories/CategoryDeleteModal.jsx';
import CategoryModal from '../components/categories/CategoryModal.jsx';
import PostCard from '../components/posts/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchCategories, fetchPosts } from '../services/api.js';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const loadCategoryPosts = async () => {
    try {
      setLoading(true);
      const [allPosts, allCategories] = await Promise.all([
        fetchPosts({ status: 'PUBLISHED' }),
        fetchCategories(),
      ]);

      setCategories(allCategories);

      if (categorySlug) {
        const matchedCategory = allCategories.find(
          (c) => c.slug === categorySlug || c.name.toLowerCase() === categorySlug.toLowerCase()
        );
        setCurrentCategory(matchedCategory || null);

        const filtered = allPosts.filter(
          (p) =>
            p.categoryId === matchedCategory?.id ||
            p.category?.name?.toLowerCase() === categorySlug.toLowerCase() ||
            p.category?.slug === categorySlug
        );
        setPosts(filtered);
      } else {
        setCurrentCategory(null);
        setPosts(allPosts);
      }
    } catch (err) {
      console.error('Error loading category page:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryPosts();
  }, [categorySlug]);

  const handleCreateNewClick = () => {
    setCategoryToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (category, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCategoryToEdit(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (category, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleCategorySaved = (savedCategory, isEdit) => {
    if (isEdit) {
      setCategories((prev) => prev.map((c) => (c.id === savedCategory.id ? savedCategory : c)));
      if (currentCategory?.id === savedCategory.id) {
        setCurrentCategory(savedCategory);
      }
    } else {
      setCategories((prev) => [...prev, savedCategory]);
    }
  };

  const handleCategoryDeleted = (deletedId) => {
    setCategories((prev) => prev.filter((c) => c.id !== deletedId));
    if (currentCategory?.id === deletedId) {
      navigate('/categories');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Category Header */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 uppercase tracking-widest">
            Category Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            {currentCategory ? currentCategory.name : categorySlug || 'All Categories'}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {currentCategory?.description ||
              `Explore published articles categorized under ${categorySlug || 'various technical topics'}.`}
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNewClick}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              + Create Category
            </button>
          </div>
        )}
      </div>

      {/* Categories Management Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">Explore & Manage Categories</h2>
          <span className="text-xs text-slate-400 font-medium">{categories.length} categories total</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            to="/categories"
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              !categorySlug
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">All Categories</span>
                <span className="text-xs bg-slate-900/80 px-2 py-0.5 rounded-full text-slate-400">
                  {posts.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">View all articles across all topics.</p>
            </div>
          </Link>

          {categories.map((cat) => {
            const isActive = categorySlug === (cat.slug || cat.name);
            return (
              <div
                key={cat.id || cat.name}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'glass-card border-slate-800 text-slate-300 hover:border-indigo-500/40'
                }`}
              >
                <Link to={`/categories/${cat.slug || cat.name}`} className="block space-y-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {cat.description || 'No description provided.'}
                  </p>
                </Link>

                {/* Edit / Delete Action Buttons (Visible for Authenticated Authors/Admins) */}
                {isAuthenticated && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => handleEditClick(cat, e)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="Edit Category Name and Description"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(cat, e)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                      title="Delete Category"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-lg font-bold text-slate-100">
          Articles in {currentCategory ? currentCategory.name : categorySlug || 'All Categories'}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl h-72 animate-pulse bg-slate-900/50" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-2">
            <p className="text-slate-300 font-medium">No published posts in this category yet</p>
            <p className="text-slate-500 text-xs">Check back later or browse other category topics.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      <CategoryModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setCategoryToEdit(null);
        }}
        category={categoryToEdit}
        onCategorySaved={handleCategorySaved}
      />

      {/* Delete Category Confirmation Modal */}
      <CategoryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        category={categoryToDelete}
        onCategoryDeleted={handleCategoryDeleted}
      />
    </div>
  );
}
