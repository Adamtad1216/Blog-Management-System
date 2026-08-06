import express from 'express';
import {
  createNewCategory,
  getAllCategories,
  getCategory,
  removeCategory,
  updateExistingCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', createNewCategory);
router.put('/:id', updateExistingCategory);
router.delete('/:id', removeCategory);

export default router;
