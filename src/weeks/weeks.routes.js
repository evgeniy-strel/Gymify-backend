import express from "express";
import { getWeeks, updateWeek } from "./weeks.service.js";

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

/**
 * PUT /weeks/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedWeek = await updateWeek({ id: req.params.id, ...req.body });

    res.json(updatedWeek);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update week",
      details: error.message,
    });
  }
});

export default router;
