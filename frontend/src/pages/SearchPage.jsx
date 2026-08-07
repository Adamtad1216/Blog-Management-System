import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/common/FilterBar.jsx';
import PostCard from '../components/posts/PostCard.jsx';
import { fetchCategories, fetchPosts } from '../services/api.js';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        const [fetchedPosts, fetchedCategories] = await Promise.all([
          fetchPosts({ search: searchQuery, categoryId: selectedCategory, status: 'PUBLISHED' }),
          fetchCategories(),
        ]);

        setPosts(fetchedPosts);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, selectedCategory]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSort('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-100">
          Search Articles {searchQuery && <span className="gradient-text">"{searchQuery}"</span>}
        </h1>
        <p className="text-slate-400 text-sm">Found {posts.length} articles matching your criteria.</p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        onResetFilters={handleReset}
      />

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
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <p className="text-slate-300 font-medium">No search results found</p>
          <p className="text-slate-500 text-xs">Try searching for different keywords or clear your active filters.</p>
          <button onClick={handleReset} className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white">
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
