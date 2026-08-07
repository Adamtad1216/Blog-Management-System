import express from 'express';
import {
  createNewTag,
  getAllTags,
  getTag,
  removeTag,
  updateExistingTag,
} from '../controllers/tagController.js';

const router = express.Router();

/**
 * @openapi
 * /api/tags:
 *   get:
 *     tags: [Tags]
 *     summary: Get all tags
 *     responses:
 *       200:
 *         description: List of tags
 */
router.get('/', getAllTags);

/**
 * @openapi
 * /api/tags/{id}:
 *   get:
 *     tags: [Tags]
 *     summary: Get a tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tag details
 */
router.get('/:id', getTag);

/**
 * @openapi
 * /api/tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create a tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTagInput'
 *     responses:
 *       201:
 *         description: Tag created
 */
router.post('/', createNewTag);

/**
 * @openapi
 * /api/tags/{id}:
 *   put:
 *     tags: [Tags]
 *     summary: Update a tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag updated
 */
router.put('/:id', updateExistingTag);

/**
 * @openapi
 * /api/tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     summary: Delete a tag
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tag deleted
 */
router.delete('/:id', removeTag);

export default router;
