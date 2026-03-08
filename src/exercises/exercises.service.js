import { supabase } from "../supabase.js";

export async function getExercises(programId, week, day) {
  const dayId = `${programId}_${week}_${day}`;

  const { data, error } = await supabase
    .from("Exercises")
    .select(
      `
      *,
      sets:Sets(*)
    `,
    )
    .eq("day_id", dayId)
    .order("created_at", { ascending: true })
    .order("created_at", { foreignTable: "Sets", ascending: true });

  if (error) {
    console.error("Supabase getExercises error:", error);
    throw error;
  }

  return data.map((exercise) => ({
    ...exercise,
    description: formatSetsToDescription(exercise.sets),
  }));
}

function formatSetsToDescription(sets) {
  if (!sets.length) {
    return "Подходы не заполнены";
  }

  let description = "";
  let group = {};

  const addDescription = (group) => {
    return ' ' + [group.weight_percent, group.reps, group.count_sets]
      .filter((v) => v)
      .join("x");
  };

  sets.forEach((set, index) => {
    const isSameGroup =
      set.weight_percent === group.weight_percent && set.reps === group.reps;

    if (!isSameGroup && index !== 0) {
      description += addDescription(group);
    }

    if (isSameGroup) {
      group.count_sets++;
    } else {
      group.weight_percent = set.weight_percent;
      group.reps = set.reps;
      group.count_sets = 1;
    }

    if (sets.length - 1 === index) {
      description += addDescription(group);
    }
  });

  return description.trim().split(" ").join("; ");
}

export async function getExerciseById(exerciseId) {
  const { data, error } = await supabase
    .from("Exercises")
    .select("*")
    .eq("id", exerciseId)
    .single();

  if (error) {
    console.error("Supabase getExerciseById error:", error);
    return null;
  }

  return data;
}

export async function createExercise(item) {
  const { data, error } = await supabase
    .from("Exercises")
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("Error creating exercise:", error);
    throw error;
  }

  return data;
}

export async function updateExercise(item) {
  const { id, ...fields } = item;

  const { data, error } = await supabase
    .from("Exercises")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating exercise:", error);
    throw error;
  }

  return data;
}
