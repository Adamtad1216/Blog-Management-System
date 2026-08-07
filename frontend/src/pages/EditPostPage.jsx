import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryModal from '../components/categories/CategoryModal.jsx';
import ImageUploader from '../components/posts/ImageUploader.jsx';
import RichEditor from '../components/posts/RichEditor.jsx';
import { fetchCategories, fetchPostById, updatePost } from '../services/api.js';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form Fields
  const [authorId, setAuthorId] = useState('');
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPostData = async () => {
      try {
        setLoading(true);
        const [postData, categoryList] = await Promise.all([fetchPostById(id), fetchCategories()]);

        setCategories(categoryList);

        if (postData) {
          setTitle(postData.title || '');
          setSlug(postData.slug || '');
          setExcerpt(postData.excerpt || '');
          setContent(postData.content || '');
          setFeaturedImage(postData.featuredImage || '');
          setStatus(postData.status || 'draft');
          setAuthorId(postData.authorId || '');
          setCategoryId(postData.categoryId || '');

          if (postData.tags) {
            const extractedTags = postData.tags.map((t) => t.tag?.name || t.name).filter(Boolean);
            setTags(extractedTags);
          }
        }
      } catch (err) {
        console.error('Error fetching post for edit:', err);
        setError('Failed to load post details for editing.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPostData();
    }
  }, [id]);

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

      if (authorId) {
        postData.authorId = authorId;
      }

      if (categoryId) {
        postData.categoryId = categoryId;
      } else if (categoryName.trim()) {
        postData.categoryName = categoryName.trim();
      }

      await updatePost(id, postData);
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.error || 'Failed to update post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading post for editing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Edit Article Mode
          </span>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-2">Edit Article #{id.slice(0, 8)}</h1>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Article Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 text-lg font-bold text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Article Excerpt</label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 rounded-xl p-3.5 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Editor */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <RichEditor value={content} onChange={setContent} />
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Status Settings</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Post Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="draft">DRAFT</option>
                  <option value="published">PUBLISHED</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </div>
            </div>

            {/* Category */}
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
            </div>

            {/* Tags */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-sm font-bold text-slate-200">Tags</label>
              <input
                type="text"
                placeholder="Type tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-3 py-2 focus:outline-none"
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 text-xs ml-1">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Image Uploader */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <ImageUploader value={featuredImage} onChange={setFeaturedImage} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Article Changes'}
            </button>
          </div>
        </div>
      </form>

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
