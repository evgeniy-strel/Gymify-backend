import express from "express";

import { getSets, createSet, updateSet, deleteSet } from "./sets.service.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /sets/:exerciseId
 * Получить подходы упражнения
 */
router.get("/:exerciseId", async (req, res) => {
  try {
    const sets = await getSets(req.params.exerciseId);
    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: "Failed to load sets", details: error.message });
  }
});

router.use(requireAdmin);

/**
 * POST /sets
 * Создать подход
 */
router.post("/", async (req, res) => {
  try {
    const set = await createSet(req.body);
    res.status(201).json(set);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create set",
      details: error.message,
    });
  }
});

/**
 * PUT /sets/:id
 * Обновить подход
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateSet(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update set",
      details: error.message,
    });
  }
});

/**
 * DELETE /sets/:id
 * Удалить подход
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteSet(req.params.id);

    res.json(deleted);
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete set",
      details: error.message,
    });
  }
});

export default router;
