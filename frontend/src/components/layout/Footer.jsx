import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl gradient-text">BlogCraft</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              Empowering creators and authors with rich content management, real-time search, tag organization, and media uploads.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/categories" className="hover:text-indigo-400 transition-colors">Categories</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition-colors">My Profile</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Author Dashboard</Link></li>
              <li><Link to="/create" className="hover:text-indigo-400 transition-colors">Create Article</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Modules</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><span className="text-indigo-400">Posts & Media Engine</span></li>
              <li><span>Category & Tag Hierarchy</span></li>
              <li><span>Real-time Full-Text Search</span></li>
              <li><span>User Authentication & Profile</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BlogCraft Platform. All rights reserved.</p>
          <p>Built with React 19, Tailwind CSS & Prisma</p>
        </div>
      </div>
    </footer>
  );
}
