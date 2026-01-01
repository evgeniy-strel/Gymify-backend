
import { supabase } from "../supabase.js";

export async function getDays(programId, weekNumber) {
  const weekId = `${programId}_${weekNumber}`;

  const { data, error } = await supabase
    .from("Days")
    .select(`
      id,
      number,
      title,
      is_completed,
      week_id,
      created_at,
      Exercises(count)
    `)
    .eq("week_id", weekId)
    .order("number");

  if (error) {
    console.error("Supabase getDays error:", error);
    throw error;
  }

  const result = data
    .map((day) => ({
      ...day,
      exercises_count: day.Exercises?.[0]?.count ?? 0,
    }))
    .map(({ Exercises, ...rest }) => rest);

  return result;
}

/**
 * Обновить день по id
 */
export async function updateDay(item) {
  const { id, ...fields } = item;

  const { data, error } = await supabase
    .from("Days")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase updateDay error:", error);
    throw error;
  }

  return data;
}
