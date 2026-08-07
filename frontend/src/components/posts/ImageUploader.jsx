import { useState } from 'react';
import { uploadImage } from '../../services/api.js';

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      // Fallback: create local object URL if backend upload endpoint fails
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-300">Featured Image</label>
        <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'upload' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'url' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {/* Image Preview Box */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 group aspect-video bg-slate-900">
          <img src={value} alt="Featured preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg"
            >
              Remove Image
            </button>
          </div>
        </div>
      ) : activeTab === 'upload' ? (
        /* File Dropzone */
        <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900/80 group">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            {uploading ? (
              <svg className="animate-spin w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium text-slate-300">
            {uploading ? 'Uploading image...' : 'Click or drop image file here'}
          </span>
          <span className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP (Max 5MB)</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
      ) : (
        /* Image URL Input */
        <div>
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
