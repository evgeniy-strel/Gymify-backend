import { supabase } from "../supabase.js";

export async function getExercises(programId, week, day) {
  const dayId = `${programId}_${week}_${day}`;

  const { data, error } = await supabase
    .from("Exercises")
    .select(`
      *,
      Sets(count)
    `)
    .eq("day_id", dayId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase getExercises error:", error);
    throw error;
  }

  return data.map((ex) => {
    const sets_count = ex.Sets?.[0]?.count ?? 0;
    const { Sets, ...rest } = ex;
    return {
      ...rest,
      sets_count,
    };
  });
}

export async function getExerciseById(exerciseId) {
  const { data, error } = await supabase
    .from("Exercises")
    .select("*")
    .eq("id", exerciseId)
    .single();

  if (error) {
    console.error("Supabase getExerciseById error:", error);
    return null;
  }

  return data;
}

export async function createExercise(item) {
  const { data, error } = await supabase
    .from("Exercises")
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("Error creating exercise:", error);
    throw error;
  }

  return data;
}

export async function updateExercise(item) {
  const { id, ...fields } = item;

  const { data, error } = await supabase
    .from("Exercises")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating exercise:", error);
    throw error;
  }

  return data;
}
