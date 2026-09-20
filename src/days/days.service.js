
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
      started_at,
      completed_at,
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
 * Получить все дни программы
 * @param {string} programId
 */
export async function getProgramDays(programId) {
  // Получаем недели программы
  const { data: weeks, error: weeksError } = await supabase
    .from("Weeks")
    .select("id, number")
    .eq("program_id", programId);

  if (weeksError) throw weeksError;

  if (!weeks.length) return [];

  const weekIds = weeks.map(w => w.id);


  return getDaysByWeeks(weekIds);
}

/**
 * Получить дни по id неделей
 */
export async function getDaysByWeeks(weekIds) {
  const { data: days, error: daysError } = await supabase
    .from("Days")
    .select("*")
    .in("week_id", weekIds)
    .order("week_id", { ascending: true })
    .order("number", { ascending: true });

  if (daysError) throw daysError;

  return days;
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

async function validateCompletedAt(id, fields) {
  if (fields.completed_at !== undefined && fields.completed_at !== null) {
    const end = typeof fields.completed_at === "string" ? Date.parse(fields.completed_at) : NaN;
    if (!Number.isFinite(end) || end > Date.now()) {
      throw Object.assign(new Error("Некорректное время окончания"), { status: 400 });
    }

    const day = await getDayById(id);
    const startedAt = fields.started_at !== undefined ? fields.started_at : day.started_at;
    const start = startedAt ? Date.parse(startedAt) : NaN;
    if (!Number.isFinite(start) || end < start) {
      throw Object.assign(new Error("Окончание должно быть не раньше начала тренировки"), { status: 400 });
    }
    fields.completed_at = new Date(end).toISOString();
  }
}

/**
 * Обновить день по id
 */
export async function updateDay(item) {
  const { id, ...fields } = item;
  await validateCompletedAt(id, fields);

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

/**
 * Удалить день по id
 */
export async function deleteDay(dayId) {
  const { data, error } = await supabase
    .from("Days")
    .delete()
    .eq("id", dayId)
    .select()
    .single();

  if (error) {
    console.error("Supabase deleteDay error:", error);
    throw error;
  }

  return data;
}