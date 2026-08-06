import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../services/auth.service.js";

import { successResponse } from "../utils/response.js";
import { sanitizeUser } from "../utils/sanitize.js";

export async function register(req, res, next) {
  const result = await registerUser(req.body);

  return successResponse(res, "User registered successfully", result, 201);
}

export async function login(req, res, next) {
  const result = await loginUser(req.body);

  return successResponse(res, "Login successful", result);
}
export async function refresh(req, res, next) {
  const { refreshToken } = req.body;

  const result = await refreshAccessToken(refreshToken);

  return successResponse(res, "Token refreshed successfully", result);
}

export async function logout(req, res, next) {
  const { refreshToken } = req.body;

  await logoutUser(refreshToken);

  return successResponse(res, "Logged out successfully");
}
export async function me(req, res, next) {
  return successResponse(
    res,

    "Current user retrieved",

    sanitizeUser(req.user),
  );
}
