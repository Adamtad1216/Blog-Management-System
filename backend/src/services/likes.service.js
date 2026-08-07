import { getPrismaClient } from "../../config/database.js";
import AppError from "../utils/AppError.js";

const prisma = getPrismaClient();

export const likePostService = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
    const count = await prisma.postLike.count({ where: { postId } });
    return { likesCount: count, isLiked: false };
  }

  const like = await prisma.postLike.create({
    data: {
      postId,
      userId,
    },
  });

  const count = await prisma.postLike.count({
    where: { postId },
  });

  return { like, likesCount: count, isLiked: true };
};

export const unlikePostService = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (!existingLike) {
    const count = await prisma.postLike.count({ where: { postId } });
    return { likesCount: count, isLiked: false };
  }

  await prisma.postLike.delete({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  const count = await prisma.postLike.count({
    where: { postId },
  });

  return { likesCount: count, isLiked: false };
};

export const getPostLikesService = async (postId, userId = null) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const count = await prisma.postLike.count({
    where: { postId },
  });

  let isLiked = false;
  if (userId) {
    const userLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
    isLiked = Boolean(userLike);
  }

  return { likesCount: count, isLiked };
};
