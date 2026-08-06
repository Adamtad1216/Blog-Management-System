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
 *     description: Retrieve all posts with optional full-text search and filtering by author, category, or status.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search term matching title, content, excerpt, or slug
 *       - in: query
 *         name: authorId
 *         schema: { type: string }
 *         description: Filter by author UUID
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *         description: Filter by category UUID
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, published, archived] }
 *         description: Filter by post status
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */
router.get('/', getAllPosts);

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get a post by ID
 *     description: Retrieve details of a single post by UUID and increment viewsCount.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Post UUID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.get('/:id', getPost);

/**
 * @openapi
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     description: Create a new blog post linked to an author user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required fields (title, content)
 */
router.post('/', createNewPost);

/**
 * @openapi
 * /api/posts/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Update an existing post
 *     description: Update post fields (title, content, excerpt, featuredImage, status, category, tags).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Post UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: string
 *               categoryName:
 *                 type: string
 *               tagNames:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.put('/:id', updateExistingPost);

/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post
 *     description: Permanently delete a post by UUID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Post UUID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.delete('/:id', removePost);

export default router;
