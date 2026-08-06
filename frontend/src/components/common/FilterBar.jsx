export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
  onResetFilters,
  showStatusFilter = false,
}) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles, keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id || cat.name} value={cat.id || cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter (Optional for Admin/Dashboard) */}
        {showStatusFilter ? (
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        ) : (
          /* Sort Option */
          <div>
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="views">Sort: Most Viewed</option>
            </select>
          </div>
        )}

        {/* Reset Action */}
        <div className="flex items-center gap-2">
          {showStatusFilter && (
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="views">Most Views</option>
            </select>
          )}
          <button
            onClick={onResetFilters}
            className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
