import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('author@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Authenticate with seeded author user session
      const authenticatedUser = {
        id: '079cdd69-05d4-4c6b-b8bf-9883afe4c452',
        fullName: 'John Author',
        username: 'john_author',
        email: email,
        avatar: 'https://example.com/avatars/john.jpg',
        role: 'author',
      };

      login(authenticatedUser, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken');
      setLoading(false);
      navigate(from, { replace: true });
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-indigo-400">
              🔐
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Author Authentication</h2>
          <p className="text-xs text-slate-400">Log in to access your Dashboard, Create articles, and Manage content.</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Author Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Author Portal'}
          </button>
        </form>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">🔑 Seeded Demo Author Credentials:</p>
          <p>• Email: <span className="font-mono text-indigo-300">author@example.com</span></p>
          <p>• Role: <span className="font-mono text-indigo-300">Author</span></p>
        </div>
      </div>
    </div>
  );
}
