"use server"

import { z } from "zod"
import { createWorkout } from "@/data/workouts"

const createWorkoutSchema = z.object({
  name: z.string().max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function createWorkoutAction(name: string, date: string) {
  const validated = createWorkoutSchema.parse({ name, date })

  return createWorkout(validated.name, new Date(`${validated.date}T00:00:00`))
}
