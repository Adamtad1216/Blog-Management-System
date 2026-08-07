import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

export const getPostsService = async (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const totalItems = await prisma.post.count();

  const posts = await prisma.post.findMany({
    skip,
    take: limitNum,
    orderBy: {
      created_at: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalItems / limitNum) || 1;

  return {
    posts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrevious: pageNum > 1,
    },
  };
};

export const getPostByIdService = async (postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return post;
};
