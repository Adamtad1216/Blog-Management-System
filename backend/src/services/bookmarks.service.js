import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

export const addBookmarkService = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (existingBookmark) {
    throw new AppError("Post is already bookmarked", 400);
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      post_id: postId,
      user_id: userId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featured_image: true,
          created_at: true,
        },
      },
    },
  });

  return bookmark;
};

export const removeBookmarkService = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (!existingBookmark) {
    throw new AppError("Bookmark not found", 404);
  }

  await prisma.bookmark.delete({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  return { message: "Bookmark removed successfully" };
};

export const getUserBookmarksService = async (userId, page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const totalItems = await prisma.bookmark.count({
    where: { user_id: userId },
  });

  const bookmarks = await prisma.bookmark.findMany({
    where: { user_id: userId },
    skip,
    take: limitNum,
    orderBy: {
      created_at: "desc",
    },
    include: {
      post: {
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
        },
      },
    },
  });

  const totalPages = Math.ceil(totalItems / limitNum) || 1;

  return {
    bookmarks,
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
