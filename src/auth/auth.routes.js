import express from "express";

const router = express.Router();

/**
 * POST /auth
 * Проверить секретный ключ
 */
router.post("/", (req, res) => {
  const { key } = req.body;

  if (key === process.env.ADMIN_PRIVATE_KEY) {
    return res.json({
      success: true,
    });
  }

  return res.status(401).json({
    success: false,
    error: "Invalid admin key",
  });
});

export default router;