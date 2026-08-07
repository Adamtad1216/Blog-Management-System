import express from 'express';
import {
  createNewPost,
  getAllPosts,
  getPost,
  removePost,
  updateExistingPost,
} from '../controllers/posts.controller.js';

const router = express.Router();

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search query
 *       - in: query
 *         name: authorId
 *         schema: { type: string }
 *         description: Filter by Author UUID
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *         description: Filter by Category UUID
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *         description: Filter by Post status
 *     responses:
 *       200:
 *         description: List of posts
 *   post:
 *     tags: [Posts]
 *     summary: Create a post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               excerpt: { type: string }
 *               featuredImage: { type: string }
 *               status: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *               publishedAt: { type: string, format: date-time }
 *               categoryId: { type: string }
 *               categoryName: { type: string }
 *               tagNames: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.get('/', getAllPosts);
router.post('/', createNewPost);

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 *   put:
 *     tags: [Posts]
 *     summary: Update a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               excerpt: { type: string }
 *               featuredImage: { type: string }
 *               status: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *               publishedAt: { type: string, format: date-time }
 *               categoryId: { type: string }
 *               categoryName: { type: string }
 *               tagNames: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Post updated successfully
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.get('/:id', getPost);
router.put('/:id', updateExistingPost);
router.delete('/:id', removePost);

export default router;
