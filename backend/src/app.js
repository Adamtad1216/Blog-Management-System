<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import commentsRoutes from './modules/comments/comments.routes.js';
import likesRoutes from './modules/likes/likes.routes.js';
import bookmarksRoutes from './modules/bookmarks/bookmarks.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint (Dev A ownership)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: { status: 'OK', timestamp: new Date() },
  });
});

// Developer C Routes (Comments, Likes, Bookmarks)
app.use('/api', commentsRoutes);
app.use('/api', likesRoutes);
app.use('/api', bookmarksRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
});
=======
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/auth.routes.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Swagger Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,

    message: "API is healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(globalErrorHandler);
>>>>>>> develop

export default app;
