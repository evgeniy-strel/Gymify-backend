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

  return data.map((item, index) => ({
    ...item,
    dynamics: index === data.length - 1 ? 0 : Number((item.value_kg - data[index + 1].value_kg).toFixed(1)),
  }))
}

/**
 * Получение всей истории веса с группировкой по году
 */
export async function getBodyWeightHistoryGrouped() {
  const data = await getBodyWeightHistory();
  const items = [];

  for (const item of data) {
    const year = new Date(item.measured_at).getFullYear();
    if (!items.find(elem => elem.id === String(year))) {
      items.push({
        created_at: new Date(year, 0, 1),
        measured_at: new Date(year, 0, 1),
        id: String(year),
        value_kg: null,
        is_year: true,
        dynamics: 0
      })
    }
    
    items.push({
      ...item,
      is_year: false
    });
  }

  return items;
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