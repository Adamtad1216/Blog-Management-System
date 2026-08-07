import { useState } from 'react';
import { calculateReadingTime, formatWordCount } from '../../utils/readingTime.js';

export default function RichEditor({ value, onChange }) {
  const [activeTab, setActiveTab] = useState('write');

  const insertText = (prefix, suffix = '') => {
    const textarea = document.getElementById('rich-editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const wordCount = formatWordCount(value);
  const readingTime = calculateReadingTime(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-300">Article Body Content</label>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{readingTime}</span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {/* Editor Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertText('**', '**')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs font-bold"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertText('*', '*')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs italic"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => insertText('## ')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              title="Heading"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertText('> ')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs"
              title="Quote"
            >
              ""
            </button>
            <button
              type="button"
              onClick={() => insertText('```\n', '\n```')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs font-mono"
              title="Code Block"
            >
              &lt;/&gt;
            </button>
            <button
              type="button"
              onClick={() => insertText('- ')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs"
              title="Bullet List"
            >
              • List
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'write' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'preview' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Text Area or Preview Render */}
        {activeTab === 'write' ? (
          <textarea
            id="rich-editor-textarea"
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your article content here (Markdown & HTML supported)..."
            className="w-full bg-slate-950/60 p-4 text-slate-100 placeholder-slate-600 focus:outline-none text-sm font-mono leading-relaxed"
          />
        ) : (
          <div className="p-6 prose prose-invert max-w-none min-h-[300px] text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
            {value ? value : <p className="text-slate-500 italic">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
