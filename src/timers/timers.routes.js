import express from "express";
import webpush from "web-push";

import { startTimer, checkTimer, resetTimer } from "./timers.service.js";

const router = express.Router();

// 🔐 VAPID
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:dev@example.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

/**
 * Сохранить подписку в БД и запустить таймер
 */
router.post("/start", async (req, res) => {
  try {
    const { subscription, seconds } = req.body;
    if (!seconds || !subscription || !seconds) return res.status(400).json({ error: "seconds, subscription and event required" });

    const timer = await startTimer(req.body);
    res.json({ ok: true, timer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error });
  }
});

router.get("/reset", async (req, res) => {
  try {
    const timer = await resetTimer();
    res.json({ ok: true, timer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err });
  }
});

router.get("/check", async (req, res) => {
  try {
    const status = await checkTimer();
    res.json({ ok: true, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err });
  }
});

export default router;
