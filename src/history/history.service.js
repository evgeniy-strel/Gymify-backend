import { supabase } from "../supabase.js";

export async function getWorkoutHistory() {
  const { data, error } = await supabase
    .from("Days")
    .select(`
      id,
      title,
      number,
      week_id,
      started_at,
      completed_at,
      created_at
    `)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

function formatWorkoutWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  let word;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    word = 'тренировок';
  } else if (lastDigit === 1) {
    word = 'тренировка';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    word = 'тренировки';
  } else {
    word = 'тренировок';
  }

  return `${count} ${word}`;
}

/**
 * Получение всей истории веса с группировкой по году
 */
export async function getWorkoutHistoryGrouped() {
  const data = await getWorkoutHistory();
  const items = [];

  for (const item of data) {
    const groupId = new Date(item.started_at).getFullYear() + '_' + new Date(item.started_at).getMonth();
    if (!items.find((elem) => elem.id === groupId)) {
      const [year, month] = groupId.split('_');
      const date = new Date(year, month, 1);
      const itemsInMonth = data.filter(dataItem => new Date(dataItem.started_at).getMonth() === Number(month)).length;
      items.push({
        completed_at: date,
        created_at: date,
        id: groupId,
        number: null,
        started_at: date,
        is_month: true,
        title: formatWorkoutWord(itemsInMonth),
        week_id: null,
      });
    }

    items.push({
      ...item,
      is_month: false,
    });
  }

  return items;
}