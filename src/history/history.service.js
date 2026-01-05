import { supabase } from "../supabase.js";

export async function getWorkoutHistory() {
  const { data, error } = await supabase
    .from("Days")
    .select(`
      id,
      title,
      number,
      week_id,
      started_at,
      completed_at,
      created_at
    `)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
