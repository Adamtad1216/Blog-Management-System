import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await login({ email: email.trim(), password });
      setLoading(false);
      navigate(from, { replace: true });
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setError(
        apiMessage ||
          "Login failed. Please check your credentials and try again.",
      );
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-slate-100">Account Login</h2>
          <p className="text-xs text-slate-400">
            Log in to manage posts, categories, and your author workspace.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Your account password"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Need an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-300 hover:text-indigo-200"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
