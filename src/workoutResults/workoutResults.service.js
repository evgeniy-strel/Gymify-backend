import { getDays, getProgramDays } from "../days/days.service.js";
import { getExercises } from "../exercises/exercises.service.js";
import { getProgramById } from "../programs/programs.service.js";
import { getWeeks } from "../weeks/weeks.service.js";

/**
 * Получение результатов тренировки по dayId
 */
export async function getWorkoutResults(programId, weekNumber, dayNumber) {
  const [program, weeks, days, thisWeekDays, exercises] = await Promise.all([
    getProgramById(programId),
    getWeeks(programId),
    getProgramDays(programId),
    getDays(programId, weekNumber),
    getExercises(programId, weekNumber, dayNumber)
  ]);

  /* Если заполнены дни в каждой недели, считаем точный процент прогресса по дням. Иначе по неделям */
  const isEveryWeekFilled = weeks.every((week) =>
    Boolean(days.find((day) => day.week_id === week.id)),
  );
  let progress;
  if (isEveryWeekFilled) {
    const completedDays = days.filter((day) => {
      const isCompleted = day.is_completed;
      const _weekNumber = Number(day.week_id.split('_').at(-1));
      const isBeforeCurrentWorkout = _weekNumber < weekNumber || (_weekNumber === weekNumber && day.number <= dayNumber);
  
      return isCompleted && isBeforeCurrentWorkout;
    }).length;

    progress = {
      before: Math.floor(((completedDays - 1) / days.length) * 100),
      after: Math.floor((completedDays / days.length) * 100),
    };
  } else {
    const completedWeeks = weeks.filter((week) => {
      const isCompleted = week.is_completed;
      const isBeforeCurrentWeek = week.number <= weekNumber;

      return isCompleted && isBeforeCurrentWeek;
    }).length;
    
    // 0.33 - это треть недели, при условии 3-х тренировок в неделю
    progress = {
      before: Math.floor(((completedWeeks - 1) / weeks.length) * 100),
      after: Math.floor((completedWeeks / weeks.length) * 100),
    };
  }
  
  const day = thisWeekDays.find(day => day.number === dayNumber);

  return { program, days: thisWeekDays, day, exercises, progress };
}
