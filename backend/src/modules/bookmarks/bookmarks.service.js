import prisma from '../../lib/prisma.js';

export const addBookmarkService = async (postId, userId) => {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (existingBookmark) {
    const error = new Error('Post is already bookmarked');
    error.statusCode = 400;
    throw error;
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      post_id: postId,
      user_id: userId,
    },
  });

  return bookmark;
};

export const removeBookmarkService = async (postId, userId) => {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (!existingBookmark) {
    const error = new Error('Bookmark not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.bookmark.delete({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  return { message: 'Bookmark removed successfully' };
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
      created_at: 'desc',
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
