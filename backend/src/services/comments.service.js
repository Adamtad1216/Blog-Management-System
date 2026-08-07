import { getPrismaClient } from "../../config/database.js";
import AppError from "../utils/AppError.js";

export const getPostCommentsService = async (postId) => {
  const prisma = getPrismaClient();
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentCommentId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
      replies: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatar: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return comments;
};

export const createCommentService = async (postId, userId, content) => {
  const prisma = getPrismaClient();
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  return comment;
};

export const replyCommentService = async (parentCommentId, userId, content) => {
  const prisma = getPrismaClient();
  const parentComment = await prisma.comment.findUnique({
    where: { id: parentCommentId },
  });

  if (!parentComment) {
    throw new AppError("Parent comment not found", 404);
  }

  const reply = await prisma.comment.create({
    data: {
      postId: parentComment.postId,
      parentCommentId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  return reply;
};

export const updateCommentService = async (commentId, userId, content) => {
  const prisma = getPrismaClient();
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.userId !== userId) {
    throw new AppError("Unauthorized to edit this comment", 403);
  }

  if (comment.isDeleted) {
    throw new AppError("Cannot edit a deleted comment", 400);
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  return updatedComment;
};

export const deleteCommentService = async (commentId, userId) => {
  const prisma = getPrismaClient();
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: true,
      replies: true,
    },
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  const isCommentAuthor = comment.userId === userId;
  const isPostAuthor = comment.post?.authorId === userId;
  const isAdmin = currentUser?.role === "ADMIN";

  if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
    throw new AppError("Unauthorized to delete this comment", 403);
  }

  if (comment.replies && comment.replies.length > 0) {
    return await prisma.comment.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
        content: "[This comment was deleted]",
      },
    });
  } else {
    return await prisma.comment.delete({
      where: { id: commentId },
    });
  }
};
