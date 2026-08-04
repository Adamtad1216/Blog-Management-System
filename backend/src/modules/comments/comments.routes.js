import { Router } from 'express';
import {
  getPostComments,
  createComment,
  replyComment,
  updateComment,
  deleteComment,
} from './comments.controller.js';

const router = Router({ mergeParams: true });

// Note: If mounted at /api/posts/:id/comments
// GET / & POST / refer to post comments
router.get('/posts/:id/comments', getPostComments);
router.post('/posts/:id/comments', createComment);

// Direct comment actions
router.post('/comments/:id/reply', replyComment);
router.patch('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

export default router;
