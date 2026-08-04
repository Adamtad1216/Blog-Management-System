import prisma from '../../lib/prisma.js';

export const likePostService = async (postId, userId) => {
  const existingLike = await prisma.postLike.findUnique({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (existingLike) {
    const error = new Error('You have already liked this post');
    error.statusCode = 400;
    throw error;
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

  return { like, likesCount: count };
};

export const unlikePostService = async (postId, userId) => {
  const existingLike = await prisma.postLike.findUnique({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (!existingLike) {
    const error = new Error('You have not liked this post');
    error.statusCode = 404;
    throw error;
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

  return { likesCount: count };
};

export const getPostLikesService = async (postId, userId = null) => {
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
