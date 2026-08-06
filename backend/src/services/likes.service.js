import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

export const likePostService = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (existingLike) {
    throw new AppError("You have already liked this post", 400);
  }

  const like = await prisma.postLike.create({
    data: {
      post_id: postId,
      user_id: userId,
    },
  });

  const count = await prisma.postLike.count({
    where: { post_id: postId },
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
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (!existingLike) {
    throw new AppError("You have not liked this post", 404);
  }

  await prisma.postLike.delete({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  const count = await prisma.postLike.count({
    where: { post_id: postId },
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
    where: { post_id: postId },
  });

  let isLiked = false;
  if (userId) {
    const userLike = await prisma.postLike.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });
    isLiked = Boolean(userLike);
  }

  return { likesCount: count, isLiked };
};
