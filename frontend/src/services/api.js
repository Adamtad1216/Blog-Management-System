import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("blog_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/")) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("blog_refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post("/api/auth/refresh", { refreshToken });
          const newAccessToken = res.data?.data?.accessToken;
          if (newAccessToken) {
            localStorage.setItem("blog_token", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (_refreshErr) {
          localStorage.removeItem("blog_token");
          localStorage.removeItem("blog_refresh_token");
          localStorage.removeItem("blog_user");
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

const unwrapData = (response) => response?.data?.data;

// Authentication API Services
export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return unwrapData(response);
};

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return unwrapData(response);
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return unwrapData(response);
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh", { refreshToken });
  return unwrapData(response);
};

export const logoutUser = async (refreshToken) => {
  const response = await api.post("/auth/logout", { refreshToken });
  return response?.data;
};

// Users API Services
export const fetchUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return unwrapData(response);
};

export const updateUserProfile = async (id, userData) => {
  const response = await api.patch(`/users/${id}`, userData);
  return unwrapData(response);
};

export const updateUserAvatar = async (id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.patch(`/users/${id}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return unwrapData(response);
};

// Posts API Services
export const fetchPosts = async (params = {}) => {
  const response = await api.get("/posts", { params });
  return unwrapData(response) || [];
};

export const fetchPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return unwrapData(response);
};

export const createPost = async (postData) => {
  const response = await api.post("/posts", postData);
  return unwrapData(response);
};

export const updatePost = async (id, postData) => {
  const response = await api.put(`/posts/${id}`, postData);
  return unwrapData(response);
};

export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return unwrapData(response);
};

// Categories API Services
export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return unwrapData(response) || [];
};

export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);
  return unwrapData(response);
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return unwrapData(response);
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return unwrapData(response);
};

// Tags API Services
export const fetchTags = async () => {
  const response = await api.get("/tags");
  return unwrapData(response) || [];
};

export const createTag = async (tagData) => {
  const response = await api.post("/tags", tagData);
  return unwrapData(response);
};

// Image Upload API Service (Cloudinary / Local Upload Endpoint)
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const data = response?.data || {};
  return data.url || data.imageUrl || data.data?.url;
};

// ─── Likes API ────────────────────────────────────────────────
export const getPostLikes = async (postId) => {
  const response = await api.get(`/posts/${postId}/likes`);
  return response?.data || { likesCount: 0, isLiked: false };
};

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response?.data;
};

export const unlikePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}/like`);
  return response?.data;
};

// ─── Bookmarks API ─────────────────────────────────────────────
export const addBookmark = async (postId) => {
  const response = await api.post(`/posts/${postId}/bookmark`);
  return response?.data;
};

export const removeBookmark = async (postId) => {
  const response = await api.delete(`/posts/${postId}/bookmark`);
  return response?.data;
};

export const getUserBookmarks = async (page = 1, limit = 20) => {
  const response = await api.get('/users/me/bookmarks', { params: { page, limit } });
  const rawData = response?.data?.data || [];
  return rawData.map((b) => b.post || b).filter(Boolean);
};

// ─── Comments API ──────────────────────────────────────────────
export const getPostComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response?.data?.data || [];
};

export const createComment = async (postId, content) => {
  const response = await api.post(`/posts/${postId}/comments`, { content });
  return response?.data?.data;
};

export const replyToComment = async (commentId, content) => {
  const response = await api.post(`/comments/${commentId}/reply`, { content });
  return response?.data?.data;
};

export const updateComment = async (commentId, content) => {
  const response = await api.patch(`/comments/${commentId}`, { content });
  return response?.data?.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response?.data;
};

export default api;
