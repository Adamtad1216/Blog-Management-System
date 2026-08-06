import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import bookmarksRoutes from "./routes/bookmarks.routes.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

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

// Developer A Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Developer B Posts Routes
app.use("/api", postsRoutes);

// Developer C Routes (Comments, Likes, Bookmarks)
app.use("/api", commentsRoutes);
app.use("/api", likesRoutes);
app.use("/api", bookmarksRoutes);

app.use(globalErrorHandler);

export default app;
