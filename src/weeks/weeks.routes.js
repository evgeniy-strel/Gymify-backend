import express from "express";
import { getWeeks } from "./weeks.service.js";

const router = express.Router();

router.get("/:programId", async (req, res) => {
  try {
    const weeks = await getWeeks(req.params.programId);
    res.json(weeks);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load weeks",
      details: error.message,
    });
  }
});

export default router;
