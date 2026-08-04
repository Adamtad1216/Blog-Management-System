import { Router } from 'express';
import { likePost, unlikePost, getPostLikes } from './likes.controller.js';

const router = Router();

router.post('/posts/:id/like', likePost);
router.delete('/posts/:id/like', unlikePost);
router.get('/posts/:id/likes', getPostLikes);

export default router;
