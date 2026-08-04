import {
  likePostService,
  unlikePostService,
  getPostLikesService,
} from './likes.service.js';

export const likePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id || req.body.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to like a post',
      });
    }

    const result = await likePostService(postId, userId);

    return res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id || req.body.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to unlike a post',
      });
    }

    const result = await unlikePostService(postId, userId);

    return res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostLikes = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id || req.query.user_id;

    const result = await getPostLikesService(postId, userId);

    return res.status(200).json({
      success: true,
      message: 'Post likes retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
