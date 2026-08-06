export function sanitizeUser(user) {
  const { password, ...safeUser } = user;

  return safeUser;
}
