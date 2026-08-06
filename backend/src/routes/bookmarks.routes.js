import { Router } from "express";
import {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
} from "../controllers/bookmarks.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/posts/{id}/bookmark:
 *   post:
 *     tags:
 *       - Bookmarks
 *     summary: Bookmark a post
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
 *       201:
 *         description: Post bookmarked successfully
 *       400:
 *         description: Already bookmarked
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Post not found
 *   delete:
 *     tags:
 *       - Bookmarks
 *     summary: Remove a bookmark from a post
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
 *         description: Bookmark removed successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Bookmark or post not found
 */
router.post("/posts/:id/bookmark", protect, addBookmark);
router.delete("/posts/:id/bookmark", protect, removeBookmark);

/**
 * @openapi
 * /api/users/me/bookmarks:
 *   get:
 *     tags:
 *       - Bookmarks
 *     summary: Get current user's bookmarked posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of bookmarked posts with pagination metadata
 *       401:
 *         description: Not authenticated
 */
router.get("/users/me/bookmarks", protect, getUserBookmarks);

export default router;
