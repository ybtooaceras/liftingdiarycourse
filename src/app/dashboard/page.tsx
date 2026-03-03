import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardCalendar } from "./_components/DashboardCalendar"
import { getWorkoutExercisesForDate } from "@/data/workouts"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date: dateStr } = await searchParams
  const date = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date()

  const workoutExercises = await getWorkoutExercisesForDate(date)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <DashboardCalendar selectedDate={date} />

          <div className="flex-1 space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Workouts for{" "}
              <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                {format(date, "do MMM yyyy")}
              </span>
            </h2>

            {workoutExercises.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-zinc-400">
                  No workouts logged for this date.
                </CardContent>
              </Card>
            ) : (
              workoutExercises.map((we) => (
                <Card key={we.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        {we.exerciseName}
                      </CardTitle>
                      <Badge variant="secondary">{we.sets.length} sets</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {we.sets.map((set, i) => (
                        <span
                          key={set.setNumber}
                          className="text-sm text-zinc-500 dark:text-zinc-400"
                        >
                          {set.reps} × {set.weight}
                          {i < we.sets.length - 1 && (
                            <span className="ml-2 text-zinc-300 dark:text-zinc-600">
                              ·
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
