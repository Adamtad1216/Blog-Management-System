import express from 'express';
import {
  createNewPost,
  getAllPosts,
  getPost,
  removePost,
  updateExistingPost,
} from '../controllers/postController.js';

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
 *         description: Search posts by title, content, or slug
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/', getAllPosts);

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
 */
router.get('/:id', getPost);

/**
 * @openapi
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       201:
 *         description: Post created
 */
router.post('/', createNewPost);

/**
 * @openapi
 * /api/posts/{id}:
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categoryName:
 *                 type: string
 *               tagNames:
 *                 type: array
 *                 items:
 *                   type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Post updated
 */
router.put('/:id', updateExistingPost);

/**
 * @openapi
 * /api/posts/{id}:
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
 *         description: Post deleted
 */
router.delete('/:id', removePost);

export default router;
