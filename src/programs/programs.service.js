import { supabase } from "../supabase.js";

export async function getPrograms() {
  const { data, error } = await supabase
    .from("Programs")
    .select("*");

  if (error) throw error;
  return data;
}

export async function getProgramById(id) {
  const { data, error } = await supabase
    .from("Programs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Обновить программу по id
 */
export async function updateProgram(item) {
  const { id, ...fields } = item;

  const { data, error } = await supabase
    .from("Programs")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase updateProgram error:", error);
    throw error;
  }

  return data;
}