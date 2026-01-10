import express from "express";
import {
  createBodyWeight,
  getBodyWeightGraphData,
  getBodyWeightHistory,
  getBodyWeightHistoryGrouped,
  getCurrentBodyWeight,
} from "./bodyWeight.service.js";

const router = express.Router();

/**
 * POST /bodyWeight
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
 * GET /bodyWeight
 */
router.get("/", async (req, res) => {
  try {
    const { grouped = false } = (req.query || {});

    const history = await (grouped ? getBodyWeightHistoryGrouped() : getBodyWeightHistory());
    res.json(history);
  } catch (err) {
    console.error("get body weight error:", err);
    res.status(500).json({ error: "Failed to load body weight history" });
  }
});

/**
 * GET /bodyWeight/graph
 */
router.get("/graph", async (req, res) => {
  try {
    const data = await getBodyWeightGraphData();
    res.json(data);
  } catch (err) {
    console.error("get body weight graph data error:", err);
    res.status(500).json({ error: "Failed to load body weight graph data" });
  }
});

/**
 * GET /bodyWeight/current
 */
router.get("/current", async (req, res) => {
  try {
    const weight = await getCurrentBodyWeight();
    res.json(weight);
  } catch (err) {
    console.error("Error getting current body weight:", err);
    res.status(500).json({ error: "Failed to get current body weight" });
  }
});

export default router;
