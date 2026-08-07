import AppError from "../utils/AppError.js";

export function checkOwnership(req, res, next) {
  const currentUserId = req.user.id;
  const resourceUserId = req.params.id;

  if (currentUserId !== resourceUserId && req.user.role !== "ADMIN") {
    throw new AppError("You are not allowed to access this resource.", 403);
  }

  next();
}
