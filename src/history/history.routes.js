import express from "express";
import { getWorkoutHistory } from "./history.service.js";

const router = express.Router();

// GET /history
router.get("/", async (req, res) => {
  try {
    const history = await getWorkoutHistory();
    res.json(history);
  } catch (err) {
    console.error("history error:", err);
    res.status(500).json({ error: "Failed to load workout history" });
  }
});

export default router;
