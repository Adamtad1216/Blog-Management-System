import express from 'express';
import {
  createNewPost,
  getAllPosts,
  getPost,
  removePost,
  updateExistingPost,
} from '../controllers/postController.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPost);
router.post('/', createNewPost);
router.put('/:id', updateExistingPost);
router.delete('/:id', removePost);

export default router;
