import { supabase } from "../supabase.js";

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
