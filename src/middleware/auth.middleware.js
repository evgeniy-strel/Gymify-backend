/* Авторизация пользователя */
export function requireAdmin(req, res, next) {
  const privateKey = req.headers["x-admin-key"];

  if (!privateKey) {
    return res.status(401).json({
      error: "You don't have permissions",
    });
  }

  if (privateKey !== process.env.ADMIN_PRIVATE_KEY) {
    return res.status(403).json({
      error: "Invalid admin key",
    });
  }

  next();
}