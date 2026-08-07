import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blog_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts API Services
export const fetchPosts = async (params = {}) => {
  const { data } = await api.get('/posts', { params });
  return data.data || [];
};

export const fetchPostById = async (id) => {
  const { data } = await api.get(`/posts/${id}`);
  return data.data;
};

export const createPost = async (postData) => {
  const { data } = await api.post('/posts', postData);
  return data.data;
};

export const updatePost = async (id, postData) => {
  const { data } = await api.put(`/posts/${id}`, postData);
  return data.data;
};

export const deletePost = async (id) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data.data;
};

// Categories API Services
export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data || [];
};

export const createCategory = async (categoryData) => {
  const { data } = await api.post('/categories', categoryData);
  return data.data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await api.put(`/categories/${id}`, categoryData);
  return data.data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data.data;
};

// Tags API Services
export const fetchTags = async () => {
  const { data } = await api.get('/tags');
  return data.data || [];
};

export const createTag = async (tagData) => {
  const { data } = await api.post('/tags', tagData);
  return data.data;
};

// Image Upload API Service (Cloudinary / Local Upload Endpoint)
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.url || data.imageUrl || data.data?.url;
};

export default api;
