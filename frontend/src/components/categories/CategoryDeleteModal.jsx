import { useState } from 'react';
import { deleteCategory } from '../../services/api.js';

export default function CategoryDeleteModal({ isOpen, onClose, category, onCategoryDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      await deleteCategory(category.id);
      if (onCategoryDeleted) {
        onCategoryDeleted(category.id);
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError(err.response?.data?.error || 'Failed to delete category. It may be linked to active posts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-red-500/30 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400 text-sm">🗑️</span>
            <h3 className="text-lg font-bold text-slate-100">Delete Category</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-900 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-200">
            Are you sure you want to delete category{' '}
            <span className="font-bold text-indigo-400">"{category.name}"</span>?
          </p>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <span>⚠️</span> Important Notice:
            </p>
            <p>Articles currently assigned to this category will become Uncategorized.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
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
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
