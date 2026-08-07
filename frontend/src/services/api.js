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

export default api;
