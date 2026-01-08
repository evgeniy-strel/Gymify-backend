import { supabase } from "../supabase.js";

/**
 * Создание записи веса тела
 */
export async function createBodyWeight(data) {
  const { data: result, error } = await supabase
    .from("BodyWeight")
    .insert([
      {
        value_kg: data.value_kg,
        measured_at: data.measured_at,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return result;
}

/**
 * Получение всей истории веса
 */
export async function getBodyWeightHistory() {
  const { data, error } = await supabase
    .from("BodyWeight")
    .select("*")
    .order("measured_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
