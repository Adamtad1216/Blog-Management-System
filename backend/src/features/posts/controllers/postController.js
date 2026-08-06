import { createPost, deletePost, getPostById, getPosts, updatePost } from '../services/postService.js';

export const getAllPosts = async (_req, res, next) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const createNewPost = async (req, res, next) => {
  try {
    const post = await createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updateExistingPost = async (req, res, next) => {
  try {
    const post = await updatePost(req.params.id, req.body);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const removePost = async (req, res, next) => {
  try {
    const post = await deletePost(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};
