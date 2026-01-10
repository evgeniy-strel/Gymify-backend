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
export async function getBodyWeightHistory(ascending = false) {
  const { data, error } = await supabase
    .from("BodyWeight")
    .select("*")
    .order("measured_at", { ascending });

  if (error) {
    throw error;
  }

  return data.map((item, index) => ({
    ...item,
    dynamics:
      index === data.length - 1
        ? 0
        : Number((item.value_kg - data[index + 1].value_kg).toFixed(1)),
  }));
}

/**
 * Получение всей истории веса с группировкой по году
 */
export async function getBodyWeightHistoryGrouped() {
  const data = await getBodyWeightHistory();
  const items = [];

  for (const item of data) {
    const year = new Date(item.measured_at).getFullYear();
    if (!items.find((elem) => elem.id === String(year))) {
      items.push({
        created_at: new Date(year, 0, 1),
        measured_at: new Date(year, 0, 1),
        id: String(year),
        value_kg: null,
        is_year: true,
        dynamics: 0,
      });
    }

    items.push({
      ...item,
      is_year: false,
    });
  }

  return items;
}

function formatShortMonth(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "short",
    year: "2-digit",
  })
    .format(date)
    .slice(0, -2)
    .replaceAll(".", "")
    .trim();
}

/**
 * Получение данных для графика
 * Возвращает до 6 самых последних взвешиваний в разные месяцы (статистика за полгода)
 */
export async function getBodyWeightGraphData() {
  const data = await getBodyWeightHistory();
  const items = [];

  for (const element of data) {
    const hasSameMonthAndYear = items.find(
      (item) =>
        new Date(item.measured_at).getMonth() ===
          new Date(element.measured_at).getMonth() &&
        new Date(item.measured_at).getFullYear() ===
          new Date(element.measured_at).getFullYear()
    );
    if (!hasSameMonthAndYear && items.length < 6) {
      items.push({
        ...element,
        short_date: formatShortMonth(new Date(element.measured_at)),
      });
    }
  }

  return items.reverse();
}

/**
 * Получение текущего веса (самое последнее взвешивание)
 */
export async function getCurrentBodyWeight() {
  const { data, error } = await supabase
    .from("BodyWeight")
    .select("*")
    .order("measured_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // supabase кидает ошибку если таблица пустая
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data;
}
