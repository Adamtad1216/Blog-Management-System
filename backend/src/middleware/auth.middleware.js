import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Not authenticated", 401));
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token expired", 401));
      }
      return next(new AppError("Invalid token", 401));
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Account is inactive", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch {
    next();
  }
}
