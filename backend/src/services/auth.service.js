import prisma from "../config/prisma.js";
import { hashPassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sanitizeUser } from "../utils/sanitize.js";
import AppError from "../utils/AppError.js";
import { comparePassword } from "../utils/password.js";

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function registerUser(data) {
  const { fullName, username, email, password } = data;
  // Check existing user
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          username,
        },
      ],
    },
  });

  if (existingUser) {
    throw new Error("Email or username already exists");
  }
  // Hash password
  const hashedPassword = await hashPassword(password);
  // Create user
  const user = await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      password: hashedPassword,
    },
  });
  // Generate tokens
  const accessToken = generateAccessToken({
    id: user.id,

    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });
  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account has been deactivated", 403);
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}
export async function refreshAccessToken(token) {
  const payload = verifyRefreshToken(token);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (!storedToken.user.isActive) {
    throw new AppError("Account has been deactivated", 403);
  }

  const accessToken = generateAccessToken({
    id: payload.id,
    role: storedToken.user.role,
  });

  return {
    accessToken,
  };
}

export async function logoutUser(refreshToken) {
  await prisma.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });
}