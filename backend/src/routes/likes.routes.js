import { Router } from "express";
import { likePost, unlikePost, getPostLikes } from "../controllers/likes.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/posts/{id}/like:
 *   post:
 *     tags:
 *       - Likes
 *     summary: Like a post
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       400:
 *         description: Already liked
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Post not found
 *   delete:
 *     tags:
 *       - Likes
 *     summary: Unlike a post
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Like or post not found
 */
router.post("/posts/:id/like", protect, likePost);
router.delete("/posts/:id/like", protect, unlikePost);

/**
 * @openapi
 * /api/posts/{id}/likes:
 *   get:
 *     tags:
 *       - Likes
 *     summary: Get likes count for a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Likes count and user like status
 *       404:
 *         description: Post not found
 */
router.get("/posts/:id/likes", getPostLikes);

export default router;
