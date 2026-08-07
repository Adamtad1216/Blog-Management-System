import express from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController.js';

const router = express.Router();

/**
 * @openapi
 * /api/upload:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload an image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/', uploadMiddleware, uploadImage);

export default router;
