import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateAvatar,
  updateRole,
} from "../services/user.service.js";

import { successResponse } from "../utils/response.js";

export async function users(req, res, next) {
  const users = await getUsers();

  successResponse(res, "Users retrieved", users);
}

export async function user(req, res, next) {
  const user = await getUserById(req.params.id);

  successResponse(res, "User retrieved", user);
}

export async function update(req, res, next) {
  const user = await updateUser(req.params.id, req.body);

  successResponse(res, "User updated", user);
}

export async function remove(req, res, next) {
  await deleteUser(req.params.id);

  successResponse(res, "User deleted");
}

export async function avatar(req, res) {
  const user = await updateAvatar(req.user.id, req.file);

  successResponse(res, "Avatar updated successfully", user);
}
export async function changeRole(req, res) {
  const user = await updateRole(req.params.id, req.body.role);

  successResponse(res, "User role updated", user);
}