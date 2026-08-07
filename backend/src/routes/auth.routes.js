import express from "express";

import {
  register,
  login,
  refresh,
  logout,
  me,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../validators/auth.validator.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         fullName:
 *           type: string
 *           example: Adam Tadesse
 *         username:
 *           type: string
 *           example: adam
 *         email:
 *           type: string
 *           format: email
 *           example: adam@example.com
 *         bio:
 *           type: string
 *           nullable: true
 *           example: Writer and developer
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/avatar.jpg
 *         role:
 *           type: string
 *           enum: [ADMIN, AUTHOR, READER]
 *           example: READER
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation completed successfully
 *         data:
 *           type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Unauthorized
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: email
 *               message:
 *                 type: string
 *                 example: Email is invalid
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Adam Tadesse
 *               username:
 *                 type: string
 *                 example: adam
 *               email:
 *                 type: string
 *                 format: email
 *                 example: adam@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: User registered successfully
 *                   data:
 *                     user:
 *                       id: 550e8400-e29b-41d4-a716-446655440000
 *                       fullName: Adam Tadesse
 *                       username: adam
 *                       email: adam@example.com
 *                       bio: null
 *                       avatar: null
 *                       role: READER
 *                       isActive: true
 *                       createdAt: 2026-08-05T12:10:17.334Z
 *                       updatedAt: 2026-08-05T12:10:17.334Z
 *                     accessToken: jwt-access-token
 *                     refreshToken: jwt-refresh-token
 *       400:
 *         description: Validation or registration error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 value:
 *                   success: false
 *                   message: Validation failed
 *                   errors:
 *                     - field: email
 *                       message: Email is invalid
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", validate(registerSchema), register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: adam@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Login successful
 *                   data:
 *                     user:
 *                       id: 550e8400-e29b-41d4-a716-446655440000
 *                       fullName: Adam Tadesse
 *                       username: adam
 *                       email: adam@example.com
 *                       bio: null
 *                       avatar: null
 *                       role: READER
 *                       isActive: true
 *                       createdAt: 2026-08-05T12:10:17.334Z
 *                       updatedAt: 2026-08-05T12:10:17.334Z
 *                     accessToken: jwt-access-token
 *                     refreshToken: jwt-refresh-token
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 value:
 *                   success: false
 *                   message: Validation failed
 *                   errors:
 *                     - field: password
 *                       message: Password is required
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   message: Unauthorized
 *                   errors: []
 */
router.post("/login", validate(loginSchema), login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: jwt-refresh-token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Token refreshed successfully
 *                   data:
 *                     accessToken: jwt-access-token
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   message: Unauthorized
 *                   errors: []
 */
router.post("/refresh", validate(refreshSchema), refresh);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log out by revoking a refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: jwt-refresh-token
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Logged out successfully
 *                   data: {}
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/logout", validate(refreshSchema), logout);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get the current authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Current user retrieved
 *                   data:
 *                     id: 550e8400-e29b-41d4-a716-446655440000
 *                     fullName: Adam Tadesse
 *                     username: adam
 *                     email: adam@example.com
 *                     bio: null
 *                     avatar: null
 *                     role: READER
 *                     isActive: true
 *                     createdAt: 2026-08-05T12:10:17.334Z
 *                     updatedAt: 2026-08-05T12:10:17.334Z
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   message: Unauthorized
 *                   errors: []
 */
router.get("/me", protect, me);

export default router;
