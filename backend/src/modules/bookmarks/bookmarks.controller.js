import {
  addBookmarkService,
  removeBookmarkService,
  getUserBookmarksService,
} from './bookmarks.service.js';

export const addBookmark = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id || req.body.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to bookmark a post',
      });
    }

    const bookmark = await addBookmarkService(postId, userId);

    return res.status(201).json({
      success: true,
      message: 'Post bookmarked successfully',
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id || req.body.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to remove bookmark',
      });
    }

    await removeBookmarkService(postId, userId);

    return res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.query.user_id;
    const { page, limit } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to view bookmarks',
      });
    }

    const { bookmarks, pagination } = await getUserBookmarksService(
      userId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: 'User bookmarks retrieved successfully',
      data: bookmarks,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};
