import express from 'express';
import postRoutes from '../features/posts/routes/postRoutes.js';
import categoryRoutes from '../features/categories/routes/categoryRoutes.js';
import tagRoutes from '../features/tags/routes/tagRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/upload', uploadRoutes);

export default router;
