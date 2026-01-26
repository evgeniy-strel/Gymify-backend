import express from "express";
import { getDays, createDay, updateDay, getDayById } from "./days.service.js";

const router = express.Router();

router.get("/:programId/:week", async (req, res) => {
  try {
    const { programId, week } = req.params;
    const days = await getDays(programId, Number(week));
    res.json(days);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load days",
      details: error.message,
    });
  }
});

// GET /days/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "day id is required" });
    }

    const day = await getDayById(id);
    res.json(day);
  } catch (err) {
    console.error("get day error:", err);
    res.status(500).json({ error: "Failed to load day" });
  }
});

/**
 * POST /days
 * body: { week_id, title }
 */
router.post("/", async (req, res) => {
  try {
    const { week_id, title } = req.body;

    if (!week_id || !title) {
      return res.status(400).json({ error: "week_id and title are required" });
    }

    const day = await createDay(week_id, title);
    res.json(day);
  } catch (err) {
    console.error("Create day error:", err);
    res.status(500).json({ error: "Failed to create day" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedDay = await updateDay({ id: req.params.id, ...req.body });

    res.json(updatedDay);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update day",
      details: error.message,
    });
  }
});

export default router;
