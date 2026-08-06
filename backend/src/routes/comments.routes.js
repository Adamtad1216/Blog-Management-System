import { Router } from "express";
import {
  getPostComments,
  createComment,
  replyComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/posts/{id}/comments:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get all comments for a post
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
 *         description: List of comments with nested replies and user info
 *       404:
 *         description: Post not found
 *   post:
 *     tags:
 *       - Comments
 *     summary: Add a comment to a post
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Great post! Very informative.
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Post not found
 */
router.get("/posts/:id/comments", getPostComments);
router.post("/posts/:id/comments", protect, createComment);

/**
 * @openapi
 * /api/comments/{id}/reply:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Reply to an existing comment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Parent Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Thanks for sharing this view!
 *     responses:
 *       201:
 *         description: Reply created successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Parent comment not found
 */
router.post("/comments/:id/reply", protect, replyComment);

/**
 * @openapi
 * /api/comments/{id}:
 *   patch:
 *     tags:
 *       - Comments
 *     summary: Edit a comment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated comment content.
 *     responses:
 *       200:
 *         description: Comment updated
 *       403:
 *         description: Unauthorized to edit
 *       404:
 *         description: Comment not found
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Soft delete a comment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment soft deleted
 *       403:
 *         description: Unauthorized to delete
 *       404:
 *         description: Comment not found
 */
router.patch("/comments/:id", protect, updateComment);
router.delete("/comments/:id", protect, deleteComment);

export default router;
