import { supabase } from "../supabase.js";

/** Первый незавершённый день первой незавершённой недели. */
export async function getNextWorkout(programId) {
  const { data: week, error: weeksError } = await supabase
    .from("Weeks")
    .select("id, number")
    .eq("program_id", programId)
    .eq("is_completed", false)
    .order("number", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (weeksError) throw weeksError;
  if (!week) return null;

  const { data: day, error: daysError } = await supabase
    .from("Days")
    .select("number")
    .eq("week_id", week.id)
    .eq("is_completed", false)
    .order("number", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (daysError) throw daysError;

  // Если дни пройдены или ещё не созданы, открываем саму неделю.
  return day
    ? { weekNumber: week.number, dayNumber: day.number }
    : { weekNumber: week.number };
}

export async function getPrograms() {
  const { data, error } = await supabase
    .from("Programs")
    .select("*")
    .order("order", { ascending: false });

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
 * Создать программу
 */
export async function createProgram({ id, title, description }) {
  const { data, error } = await supabase
    .from("Programs")
    .insert([
      {
        id,
        title,
        description,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("createProgram error:", error);
    throw error;
  }

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

/**
 * Удалить программу по id
 */
export async function deleteProgram(id) {
  const { data, error } = await supabase
    .from("Programs")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase deleteProgram error:", error);
    throw error;
  }

  return data;
}

/**
 * Клонирование программы (всех записей таблицы: weeks, days, exercises, sets)
 * При ошибке создания одной из сущности завершает процесс
 */
export async function duplicateProgram(id) {
  const { data, error } = await supabase.rpc("duplicate_program", {
    p_program_id: id,
  });

  if (error) {
    throw error;
  }

  return {
    id: data,
  };
};
