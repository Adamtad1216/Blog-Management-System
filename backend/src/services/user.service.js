import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { uploadToCloudinary } from "../utils/uploadCloudinary.js";
import { fileTypeFromBuffer } from "file-type";

export async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map(sanitizeUser);
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
}

export async function updateUser(id, data) {
  const user = await prisma.user.update({
    where: {
      id,
    },

    data,
  });

  return sanitizeUser(user);
}

export async function deleteUser(id) {
  await prisma.user.delete({
    where: {
      id,
    },
  });
}

export async function updateAvatar(userId, file) {
  if (!file || !file.buffer) {
    throw new AppError("Avatar file is required", 400);
  }

  const fileType = await fileTypeFromBuffer(file.buffer);

  if (!fileType || !fileType.mime.startsWith("image/")) {
    throw new AppError("Only images are allowed", 400);
  }

  const result = await uploadToCloudinary(file.buffer);

  const user = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      avatar: result.secure_url,
    },
  });

  return sanitizeUser(user);
}

export async function updateRole(id, role) {
  const user = await prisma.user.update({
    where: {
      id,
    },

    data: {
      role,
    },
  });

  return sanitizeUser(user);
}