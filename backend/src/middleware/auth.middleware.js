import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Not authenticated", 401);
  }

  const token = authHeader.split(" ")[1];

  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });

  if (!user) {
    throw new AppError("User not found", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  req.user = user;

  next();
}
