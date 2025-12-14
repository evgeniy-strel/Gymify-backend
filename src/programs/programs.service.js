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
