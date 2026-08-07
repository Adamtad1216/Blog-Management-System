import { createPost, deletePost, getPostById, getPosts, updatePost } from '../services/postService.js';

export const getAllPosts = async (req, res, next) => {
  try {
    const { search, q, authorId, categoryId, status } = req.query;
    const queryOptions = {
      search: search || q || '',
      authorId,
      categoryId,
      status,
    };
    const posts = await getPosts(queryOptions);
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id, true);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const createNewPost = async (req, res, next) => {
  try {
    const {
      authorId,
      title,
      content,
      excerpt,
      featuredImage,
      status,
      publishedAt,
      categoryId,
      categoryName,
      tagNames,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = await createPost({
      authorId: authorId || req.user?.id,
      title,
      content,
      excerpt,
      featuredImage,
      status,
      publishedAt,
      categoryId,
      categoryName,
      tagNames,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updateExistingPost = async (req, res, next) => {
  try {
    const existingPost = await getPostById(req.params.id, false);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = await updatePost(req.params.id, req.body);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const removePost = async (req, res, next) => {
  try {
    const existingPost = await getPostById(req.params.id, false);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = await deletePost(req.params.id);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

