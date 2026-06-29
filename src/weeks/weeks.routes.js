import express from "express";

import { getWeeks, createWeek, updateWeek, deleteWeek } from "./weeks.service.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

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

router.use(requireAdmin);

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

/**
 * PUT /delete/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedWeek = await deleteWeek(req.params.id);

    res.json(deletedWeek);
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete week",
      details: error.message,
    });
  }
});

export default router;
