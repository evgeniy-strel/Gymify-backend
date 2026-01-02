import webpush from "web-push";

import { supabase } from "../supabase.js";

const TIMER_ID = 'rest_timer';

/**
 * Старт таймера: сохраняет подписку в БД
 */
export async function startTimer({ seconds, subscription, event }) {
  const now = new Date();
  const endAt = new Date(Date.now() + seconds * 1000);

  const { data, error } = await supabase
    .from("Timers")
    .upsert({
      id: TIMER_ID,
      created_at: now,
      end_at: endAt,
      subscription,
      event,
      message: {
        title: "⏱ Таймер",
        body: "Время отдыха закончилось",
      }
    })
    .select()
    .single();
  

  if (error) throw error;
  return data;
}

/**
 * Проверка таймера: если закончился — отправляет push при необходимости и сбрасывает таймер
 */
export async function checkTimer() {
  const { data: timer, error } = await supabase
    .from("Timers")
    .select("*")
    .eq("id", TIMER_ID)
    .single();

  if (error || !timer || !timer.subscription || !timer.end_at) return { active: false };
    
  const now = new Date();
  const endAt = new Date(timer.end_at);

  // Таймер ещё активен
  if (now < endAt) {
      return {
          active: true,
          started: timer.created_at,
          end: timer.end_at,
          secondsLeft: Math.ceil((endAt.getTime() - now.getTime()) / 1000),
          event: timer.event
      };
  }

  // Таймер закончился — шлём push
  try {
    await webpush.sendNotification(
      timer.subscription,
      JSON.stringify(timer.message)
    );
  } catch (err) {
    console.error("Failed to send push", err);
  }

  // Сбрасываем запись
  await supabase
    .from("Timers")
    .update({ end_at: null, subscription: null, event: null, message: null })
    .eq("id", "rest_timer");

  return { active: false };
}