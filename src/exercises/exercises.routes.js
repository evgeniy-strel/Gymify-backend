// src/exercises/exercises.routes.js
import express from "express";
import { createExercise, updateExercise, getExercises, getExerciseById } from "./exercises.service.js";

const router = express.Router();

/**
 * GET /exercises/:programId/:week/:day
 * Получить все упражнения для дня
 */
router.get("/:programId/:week/:day", async (req, res) => {
  try {
    const { programId, week, day } = req.params;
    const exercises = await getExercises(programId, Number(week), Number(day));
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Failed to load exercises", details: error.message });
  }
});

/**
 * GET /exercises/:id
 * Получить упражнение по id
 */
router.get("/:id", async (req, res) => {
  try {
    const exercise = await getExerciseById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Failed to load exercise", details: error.message });
  }
});

/**
 * POST /exercises
 * Создать упражнение
 */
router.post("/", async (req, res) => {
  try {
    const exercise = await createExercise(req.body);
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /exercises/:id
 * Обновить упражнение по id
 */
router.put("/:id", async (req, res) => {
  try {
    const exercise = await updateExercise({ id: req.params.id, ...req.body });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
