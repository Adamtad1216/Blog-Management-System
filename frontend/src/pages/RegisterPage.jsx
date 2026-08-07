import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { uploadImage } from "../services/api.js";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let uploadedAvatarUrl = "";
      if (avatarFile) {
        uploadedAvatarUrl = await uploadImage(avatarFile);
      }

      await register({
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        bio: formData.bio.trim() || undefined,
        avatar: uploadedAvatarUrl || undefined,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const apiMessage = err?.response?.data?.message || err?.message;
      const fieldErrors = err?.response?.data?.errors;
      const firstFieldError = Array.isArray(fieldErrors)
        ? fieldErrors[0]?.message
        : "";
      setError(
        firstFieldError ||
          apiMessage ||
          "Registration failed. Please check your input and try again.",
      );
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-indigo-400 text-lg">
              ✍️
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400">
            Join BlogCraft to write articles, engage in comments, and manage your author workspace.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar File Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-2 pb-2">
            <label className="block text-xs font-semibold text-slate-300">
              Profile Avatar
            </label>
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-full flex flex-col items-center justify-center text-slate-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-input"
                className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg"
                title="Choose Avatar Image"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            {avatarFile && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-indigo-300 font-medium truncate max-w-[150px]">
                  {avatarFile.name}
                </span>
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              placeholder="e.g. janedoe"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. jane@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              rows={2}
              placeholder="Tell us a little bit about yourself..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account & uploading avatar..." : "Register Account"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-300 hover:text-indigo-200"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
