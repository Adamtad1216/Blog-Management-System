import {
  likePostService,
  unlikePostService,
  getPostLikesService,
} from "../services/likes.service.js";
import { successResponse } from "../utils/response.js";

export const likePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const result = await likePostService(postId, userId);

    return successResponse(res, "Post liked successfully", result, 200);
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const result = await unlikePostService(postId, userId);

    return successResponse(res, "Post unliked successfully", result, 200);
  } catch (error) {
    next(error);
  }
};

export const getPostLikes = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id || req.query.user_id;

    const result = await getPostLikesService(postId, userId);

    return successResponse(res, "Post likes retrieved successfully", result, 200);
  } catch (error) {
    next(error);
  }
};
