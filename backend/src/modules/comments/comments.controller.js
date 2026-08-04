import {
  getPostCommentsService,
  createCommentService,
  replyCommentService,
  updateCommentService,
  deleteCommentService,
} from './comments.service.js';

export const getPostComments = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const comments = await getPostCommentsService(postId);

    return res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id || req.body.user_id; // Fallback for dev testing before Auth middleware
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'content', message: 'Comment content is required' }],
      });
    }

    const comment = await createCommentService(postId, userId, content.trim());

    return res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const replyComment = async (req, res, next) => {
  try {
    const { id: parentCommentId } = req.params;
    const userId = req.user?.id || req.body.user_id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'content', message: 'Reply content is required' }],
      });
    }

    const reply = await replyCommentService(parentCommentId, userId, content.trim());

    return res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user?.id || req.body.user_id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'content', message: 'Comment content cannot be empty' }],
      });
    }

    const updatedComment = await updateCommentService(commentId, userId, content.trim());

    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user?.id || req.body.user_id;

    const deletedComment = await deleteCommentService(commentId, userId);

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: deletedComment,
    });
  } catch (error) {
    next(error);
  }
};
