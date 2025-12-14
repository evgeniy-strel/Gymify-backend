import { supabase } from "../supabase.js";

export async function getSets(exerciseId) {
  const { data, error } = await supabase
    .from("Sets")
    .select("*")
    .eq("exercise_id", exerciseId)
    .order("order", { ascending: true });

  if (error) {
    console.error("Supabase getSets error:", error);
    throw error;
  }

  return data;
}

/**
 * Создать подход
 */
export async function createSet(payload) {
  const { data, error } = await supabase
    .from("Sets")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Supabase createSet error:", error);
    throw error;
  }

  return data;
}

/**
 * Обновить подход
 */
export async function updateSet(id, fields) {
  const { data, error } = await supabase
    .from("Sets")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase updateSet error:", error);
    throw error;
  }

  return data;
}