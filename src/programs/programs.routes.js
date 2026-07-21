import express from "express";

import { getPrograms, getProgramById, createProgram, updateProgram, deleteProgram, duplicateProgram } from "./programs.service.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

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

router.use(requireAdmin);

router.post("/", async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id || !title) {
      return res.status(400).json({
        error: "id and title are required",
      });
    }

    const program = await createProgram({
      id,
      title,
      description,
    });

    res.json(program);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create program",
    });
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

/**
 * DELETE /programs/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const program = await deleteProgram(req.params.id);

    res.json(program);
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete program",
      details: error.message,
    });
  }
});

/**
 * POST /programs/:id/duplicate
 */
router.post("/:id/duplicate", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Program id is required",
      });
    }

    const duplicatedProgram = await duplicateProgram(id);

    res.status(201).json(duplicatedProgram);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
