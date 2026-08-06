import {
  addBookmarkService,
  removeBookmarkService,
  getUserBookmarksService,
} from "../services/bookmarks.service.js";
import { successResponse } from "../utils/response.js";

export const addBookmark = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const bookmark = await addBookmarkService(postId, userId);

    return successResponse(res, "Post bookmarked successfully", bookmark, 201);
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    await removeBookmarkService(postId, userId);

    return successResponse(res, "Bookmark removed successfully", {}, 200);
  } catch (error) {
    next(error);
  }
};

export const getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;

    const { bookmarks, pagination } = await getUserBookmarksService(
      userId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "User bookmarks retrieved successfully",
      data: bookmarks,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};
