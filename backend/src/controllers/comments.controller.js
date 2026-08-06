import {
  getPostCommentsService,
  createCommentService,
  replyCommentService,
  updateCommentService,
  deleteCommentService,
} from "../services/comments.service.js";
import { successResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";

export const getPostComments = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const comments = await getPostCommentsService(postId);

    return successResponse(res, "Comments retrieved successfully", comments, 200);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      throw new AppError("Comment content is required", 400);
    }

    const comment = await createCommentService(postId, userId, content.trim());

    return successResponse(res, "Comment created successfully", comment, 201);
  } catch (error) {
    next(error);
  }
};

export const replyComment = async (req, res, next) => {
  try {
    const { id: parentCommentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      throw new AppError("Reply content is required", 400);
    }

    const reply = await replyCommentService(parentCommentId, userId, content.trim());

    return successResponse(res, "Reply added successfully", reply, 201);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      throw new AppError("Comment content cannot be empty", 400);
    }

    const updatedComment = await updateCommentService(commentId, userId, content.trim());

    return successResponse(res, "Comment updated successfully", updatedComment, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user.id;

    const deletedComment = await deleteCommentService(commentId, userId);

    return successResponse(res, "Comment deleted successfully", deletedComment, 200);
  } catch (error) {
    next(error);
  }
};
