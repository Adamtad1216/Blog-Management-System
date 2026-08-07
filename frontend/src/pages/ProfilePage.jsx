import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchPosts,
  updateUserAvatar,
  updateUserProfile,
} from "../services/api.js";
import PostCard from "../components/posts/PostCard.jsx";

export default function ProfilePage() {
  const { user, updateUserInContext } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  useEffect(() => {
    const loadUserPosts = async () => {
      if (!user?.id) return;
      try {
        setLoadingPosts(true);
        const allPosts = await fetchPosts();
        // Filter posts created by the current logged in user
        const authored = allPosts.filter(
          (p) => p.authorId === user.id || p.author?.id === user.id
        );
        setUserPosts(authored);
      } catch (err) {
        console.error("Error loading user posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadUserPosts();
  }, [user?.id]);

  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));

    // Upload avatar immediately
    try {
      setUploadingAvatar(true);
      setErrorMessage("");
      setSuccessMessage("");

      const updatedUser = await updateUserAvatar(user.id, file);
      updateUserInContext(updatedUser);
      setSuccessMessage("Profile avatar updated successfully!");
    } catch (err) {
      console.error("Failed to update avatar:", err);
      setErrorMessage(
        err?.response?.data?.message || "Failed to upload avatar image."
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      setErrorMessage("Full name and username are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const updatedUser = await updateUserProfile(user.id, {
        fullName: fullName.trim(),
        username: username.trim(),
        bio: bio.trim() || null,
      });

      updateUserInContext(updatedUser);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMessage(
        err?.response?.data?.message || "Failed to update profile details."
      );
    } finally {
      setSaving(false);
    }
  };

  const totalViews = userPosts.reduce(
    (sum, p) => sum + (p.viewsCount || 0),
    0
  );
  const publishedCount = userPosts.filter(
    (p) => String(p.status).toUpperCase() === "PUBLISHED"
  ).length;

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Member";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-300">
            ✅ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-300">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar Container with Upload overlay */}
          <div className="relative group flex-shrink-0">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={user?.fullName || "User Avatar"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-2xl text-indigo-300">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <label
              htmlFor="profile-avatar-input"
              className="absolute bottom-1 right-1 p-2 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-500 transition-transform hover:scale-110 shadow-lg"
              title="Change Profile Avatar"
            >
              {uploadingAvatar ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </label>
            <input
              id="profile-avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarFileSelect}
              className="hidden"
            />
          </div>

          {/* User Details / Form */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            {!isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-100">
                      {user?.fullName}
                    </h1>
                    <p className="text-sm text-indigo-400 font-medium">
                      @{user?.username}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-center sm:self-start">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                      {user?.role || "READER"}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  {user?.bio || "No bio provided yet. Click 'Edit Profile' to add your bio."}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>✉️ {user?.email}</span>
                  <span>•</span>
                  <span>🗓️ Joined {formattedDate}</span>
                </div>
              </div>
            ) : (
              /* Profile Edit Form */
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <h2 className="text-xl font-bold text-slate-100">Edit Profile Details</h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a brief bio about yourself..."
                    className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(user?.fullName || "");
                      setUsername(user?.username || "");
                      setBio(user?.bio || "");
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Author Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Articles Authored</p>
          <p className="text-3xl font-black text-slate-100">{userPosts.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-1">
          <p className="text-xs text-emerald-400 font-medium">Published Articles</p>
          <p className="text-3xl font-black text-emerald-400">{publishedCount}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-1">
          <p className="text-xs text-purple-400 font-medium">Total Article Views</p>
          <p className="text-3xl font-black text-purple-400">{totalViews}</p>
        </div>
      </div>

      {/* User Authored Articles Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Your Articles</h2>
          <Link
            to="/create"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            + Create Article
          </Link>
        </div>

        {loadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl h-72 animate-pulse bg-slate-900/50"
              />
            ))}
          </div>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} showActions />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <p className="text-slate-300 font-medium">
              You haven't published any articles yet
            </p>
            <p className="text-slate-500 text-xs">
              Start writing your first story to share with the community.
            </p>
            <Link
              to="/create"
              className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"
            >
              Write First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
