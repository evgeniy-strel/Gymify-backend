import express from "express";
import {
  createBodyWeight,
  getBodyWeightHistory,
} from "./bodyWeight.service.js";

const router = express.Router();

/**
 * POST /body-weight
 * body: { value_kg, measured_at }
 */
router.post("/", async (req, res) => {
  try {
    const { value_kg, measured_at } = req.body;

    if (value_kg == null || !measured_at) {
      return res.status(400).json({
        error: "value_kg and measured_at are required",
      });
    }

    const record = await createBodyWeight(req.body);
    res.json(record);
  } catch (err) {
    console.error("create body weight error:", err);
    res.status(500).json({ error: "Failed to create body weight record" });
  }
});

/**
 * GET /body-weight
 */
router.get("/", async (_req, res) => {
  try {
    const history = await getBodyWeightHistory();
    res.json(history);
  } catch (err) {
    console.error("get body weight error:", err);
    res.status(500).json({ error: "Failed to load body weight history" });
  }
});

export default router;
