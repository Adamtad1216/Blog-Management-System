import { Router } from 'express';
import {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
} from './bookmarks.controller.js';

const router = Router();

router.post('/posts/:id/bookmark', addBookmark);
router.delete('/posts/:id/bookmark', removeBookmark);
router.get('/users/me/bookmarks', getUserBookmarks);

export default router;
