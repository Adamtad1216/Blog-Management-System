import { getPostsService, getPostByIdService } from "../services/posts.service.js";
import { successResponse } from "../utils/response.js";

export const getPosts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { posts, pagination } = await getPostsService(page, limit);

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: posts,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const post = await getPostByIdService(postId);

    return successResponse(res, "Post retrieved successfully", post, 200);
  } catch (error) {
    next(error);
  }
};
