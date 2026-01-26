
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
 * Получения дня по идентификатору
 */
export async function getDayById(dayId) {
  const { data, error } = await supabase
    .from("Days")
    .select("*")
    .eq("id", dayId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Создание нового дня для недели
 * @param {string} weekId
 * @param {string} title
 */
export async function createDay(weekId, title) {
  // 1. Получаем количество дней с этой недели
  const { data: existingDays, error: countError } = await supabase
    .from("Days")
    .select("number")
    .eq("week_id", weekId);

  if (countError) throw countError;

  // 2. Вычисляем номер дня
  const number = existingDays?.length ? existingDays.length + 1 : 1;

  // 3. Формируем id
  const id = `${weekId}_${number}`;

  // 4. Создаём запись
  const { data, error } = await supabase
    .from("Days")
    .insert([
      {
        id,
        week_id: weekId,
        title,
        number,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
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
