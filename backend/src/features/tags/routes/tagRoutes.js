import express from 'express';
import {
  createNewTag,
  getAllTags,
  getTag,
  removeTag,
  updateExistingTag,
} from '../controllers/tagController.js';

const router = express.Router();

router.get('/', getAllTags);
router.get('/:id', getTag);
router.post('/', createNewTag);
router.put('/:id', updateExistingTag);
router.delete('/:id', removeTag);

export default router;
