import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

export const getPostCommentsService = async (postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comments = await prisma.comment.findMany({
    where: {
      post_id: postId,
      parent_comment_id: null,
    },
    orderBy: {
      created_at: "desc",
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
          created_at: "asc",
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
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment = await prisma.comment.create({
    data: {
      post_id: postId,
      user_id: userId,
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
  const parentComment = await prisma.comment.findUnique({
    where: { id: parentCommentId },
  });

  if (!parentComment) {
    throw new AppError("Parent comment not found", 404);
  }

  const reply = await prisma.comment.create({
    data: {
      post_id: parentComment.post_id,
      parent_comment_id: parentCommentId,
      user_id: userId,
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
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.user_id !== userId) {
    throw new AppError("Unauthorized to edit this comment", 403);
  }

  if (comment.is_deleted) {
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
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.user_id !== userId) {
    throw new AppError("Unauthorized to delete this comment", 403);
  }

  const deletedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      is_deleted: true,
      content: "[This comment has been deleted]",
    },
  });

  return deletedComment;
};
