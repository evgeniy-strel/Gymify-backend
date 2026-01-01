import express from "express";
import { getPrograms, getProgramById } from "./programs.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const programs = await getPrograms();
    res.json(programs);
  } catch (error) {
    console.error("getPrograms error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const program = await getProgramById(req.params.id);
    res.json(program);
  } catch (error) {
    console.error("getProgramById error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /programs/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const program = await updateProgram({ id: req.params.id, ...req.body });
    res.json(program);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update program",
      details: error.message,
    });
  }
});

export default router;
