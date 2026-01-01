import express from "express";
import { getDays, updateDay } from "./days.service.js";

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
