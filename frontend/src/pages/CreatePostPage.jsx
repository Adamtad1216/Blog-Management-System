import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryModal from '../components/categories/CategoryModal.jsx';
import ImageUploader from '../components/posts/ImageUploader.jsx';
import RichEditor from '../components/posts/RichEditor.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { createPost, fetchCategories } from '../services/api.js';

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form Fields (authorId handled behind the scenes via AuthContext / req.user)
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  // Auto generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  // Add tag pill on Enter or comma
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const postData = {
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
        featuredImage,
        status,
        tagNames: tags,
      };

      if (user?.id) {
        postData.authorId = user.id;
      }

      if (categoryId) {
        postData.categoryId = categoryId;
      } else if (categoryName.trim()) {
        postData.categoryName = categoryName.trim();
      }

      const created = await createPost(postData);
      navigate(`/posts/${created.id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.error || 'Failed to create post. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Post Creation Engine
          </span>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-2">Create New Article</h1>
          <p className="text-slate-400 text-sm">Craft compelling stories with custom tags, categories, and cover media.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Article Title *</label>
                <input
                  type="text"
                  placeholder="Enter a captivating title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 text-lg font-bold text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Article Excerpt / Summary</label>
              <textarea
                rows={3}
                placeholder="Brief summary of the article for cards and search results..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl p-3.5 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Rich Editor Component */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <RichEditor value={content} onChange={setContent} />
            </div>
          </div>

          {/* Settings Sidebar Column (1 col) */}
          <div className="space-y-6">
            {/* Publish Status */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Publication Settings</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Post Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="draft">DRAFT (Saved internally)</option>
                  <option value="published">PUBLISHED (Visible on site)</option>
                  <option value="archived">ARCHIVED (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Category Selector */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-200">Category</label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  + New
                </button>
              </div>

              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setCategoryName('');
                }}
                className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {!categoryId && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Or type category name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Artificial Intelligence"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-3 py-1.5 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Tag Input Component */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-sm font-bold text-slate-200">Tags</label>
              <input
                type="text"
                placeholder="Type tag and press Enter or comma..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none"
              />

              {/* Tag Pills Display */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 text-xs ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Image Uploader Component */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <ImageUploader value={featuredImage} onChange={setFeaturedImage} />
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? 'Creating Post...' : 'Publish Article Now'}
            </button>
          </div>
        </div>
      </form>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={(newCat) => {
          setCategories((prev) => [...prev, newCat]);
          setCategoryId(newCat.id);
        }}
      />
    </div>
  );
}
