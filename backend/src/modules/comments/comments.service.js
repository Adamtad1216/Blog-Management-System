import prisma from '../../lib/prisma.js';

export const getPostCommentsService = async (postId) => {
  // Fetch top-level comments (parent_comment_id is null) with nested replies
  const comments = await prisma.comment.findMany({
    where: {
      post_id: postId,
      parent_comment_id: null,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      replies: {
        orderBy: {
          created_at: 'asc',
        },
        include: {
          replies: true,
        },
      },
    },
  });

  return comments;
};

export const createCommentService = async (postId, userId, content) => {
  const comment = await prisma.comment.create({
    data: {
      post_id: postId,
      user_id: userId,
      content,
    },
  });

  return comment;
};

export const replyCommentService = async (parentCommentId, userId, content) => {
  const parentComment = await prisma.comment.findUnique({
    where: { id: parentCommentId },
  });

  if (!parentComment) {
    const error = new Error('Parent comment not found');
    error.statusCode = 404;
    throw error;
  }

  const reply = await prisma.comment.create({
    data: {
      post_id: parentComment.post_id,
      parent_comment_id: parentCommentId,
      user_id: userId,
      content,
    },
  });

  return reply;
};

export const updateCommentService = async (commentId, userId, content) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    throw error;
  }

  if (comment.user_id !== userId) {
    const error = new Error('Unauthorized to edit this comment');
    error.statusCode = 403;
    throw error;
  }

  if (comment.is_deleted) {
    const error = new Error('Cannot edit a deleted comment');
    error.statusCode = 400;
    throw error;
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });

  return updatedComment;
};

export const deleteCommentService = async (commentId, userId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    throw error;
  }

  if (comment.user_id !== userId) {
    const error = new Error('Unauthorized to delete this comment');
    error.statusCode = 403;
    throw error;
  }

  // Soft delete comment
  const deletedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      is_deleted: true,
      content: '[This comment has been deleted]',
    },
  });

  return deletedComment;
};
