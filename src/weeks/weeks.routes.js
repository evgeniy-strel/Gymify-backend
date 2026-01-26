import express from "express";
import { getWeeks, createWeek, updateWeek } from "./weeks.service.js";

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
 * POST /weeks
 * body: { program_id }
 */
router.post("/", async (req, res) => {
  try {
    const { program_id } = req.body;

    if (!program_id) {
      return res.status(400).json({ error: "program_id is required" });
    }

    const week = await createWeek(program_id);
    res.json(week);
  } catch (err) {
    console.error("Create week error:", err);
    res.status(500).json({ error: "Failed to create week" });
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
