import { supabase } from "../supabase.js";
import { updateProgram } from "../programs/programs.service.js";

export async function getWeeks(programId) {
  const { data, error } = await supabase
    .from("Weeks")
    .select("*")
    .eq("program_id", programId)
    .order("number", { ascending: true });

  if (error) {
    console.error("Supabase getWeeks error:", error);
    throw error;
  }

  return data;
}

export async function getWeek(id) {
  const { data, error } = await supabase
    .from("Weeks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to load week:", error);
    throw error;
  }

  return data;
}

/**
 * Функция обновления недели, если она завершена, то обновляем у программы текущий прогресс
 */
export async function updateWeek(item) {
  const { id, ...fields } = item;

  const { data, error } = await supabase
    .from("Weeks")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase updateWeek error:", error);
    throw error;
  }

  if (!fields.is_completed) {
    return data;
  }

  const week = await getWeek(id);
  const weeks = await getWeeks(week.program_id);
  const completedWeeks = weeks.filter(week => week.is_completed).length;
  await updateProgram({
    id: week.program_id,
    currentWeek: completedWeeks
  })

  return data;
}
