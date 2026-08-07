import express from 'express';
import postRoutes from './posts.routes.js';
import categoryRoutes from './categories.routes.js';
import tagRoutes from './tags.routes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/upload', uploadRoutes);

export default router;
