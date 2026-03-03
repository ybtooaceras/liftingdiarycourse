import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { workouts, workoutExercises, exercises, sets } from "@/db/schema"
import { eq, and, gte, lt } from "drizzle-orm"

export async function getWorkoutExercisesForDate(date: Date) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const rows = await db
    .select({
      workoutExerciseId: workoutExercises.id,
      exerciseName: exercises.name,
      order: workoutExercises.order,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weight: sets.weight,
    })
    .from(workouts)
    .innerJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .innerJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay),
        lt(workouts.startedAt, endOfDay)
      )
    )
    .orderBy(workoutExercises.order, sets.setNumber)

  const map = new Map<
    string,
    {
      exerciseName: string
      sets: { setNumber: number; reps: number | null; weight: string | null }[]
    }
  >()

  for (const row of rows) {
    if (!map.has(row.workoutExerciseId)) {
      map.set(row.workoutExerciseId, { exerciseName: row.exerciseName, sets: [] })
    }
    map.get(row.workoutExerciseId)!.sets.push({
      setNumber: row.setNumber,
      reps: row.reps,
      weight: row.weight,
    })
  }

  return Array.from(map.entries()).map(([id, data]) => ({
    id,
    exerciseName: data.exerciseName,
    sets: data.sets,
  }))
}
