import { useEffect, useState } from 'react';
import { createCategory, updateCategory } from '../../services/api.js';

export default function CategoryModal({ isOpen, onClose, category = null, onCategorySaved }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(category && category.id);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Category name is required.');
      return false;
    }
    if (trimmedName.length < 2) {
      setError('Category name must be at least 2 characters long.');
      return false;
    }
    if (trimmedName.length > 50) {
      setError('Category name cannot exceed 50 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setError('');

      const categoryData = {
        name: name.trim(),
        description: description.trim(),
      };

      let result;
      if (isEdit) {
        result = await updateCategory(category.id, categoryData);
      } else {
        result = await createCategory(categoryData);
      }

      if (onCategorySaved) {
        onCategorySaved(result, isEdit);
      }

      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error('Failed to save category:', err);
      setError(
        err.response?.data?.error ||
          (isEdit ? 'Failed to update category.' : 'Category already exists or creation failed.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-indigo-500/20 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm">📁</span>
            <h3 className="text-lg font-bold text-slate-100">
              {isEdit ? 'Edit Category' : 'Create New Category'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-900 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category Name <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Artificial Intelligence"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              maxLength={50}
              required
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
            <span className="text-[10px] text-slate-500 mt-1 block text-right">
              {name.length}/50 characters
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of articles in this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl p-3.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {loading ? (isEdit ? 'Saving Changes...' : 'Creating...') : isEdit ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
