import express from "express";
import { getWorkoutResults } from "./workoutResults.service.js";

const router = express.Router();

/* Получение результатов тренировки */
router.get("/:programId/:weekNumber/:dayNumber", async (req, res) => {
  try {
    const { programId, weekNumber, dayNumber } = req.params;

    if (!programId || !weekNumber || !dayNumber) {
      return res.status(400).json({ error: "programId, weekNumber and dayNumber is required" });
    }

    const results = await getWorkoutResults(programId, Number(weekNumber), Number(dayNumber));

    res.json(results);
  } catch (err) {
    console.error("Workout results error:", err);
    res.status(500).json({ error: "Failed to get workout results" });
  }
});

export default router;