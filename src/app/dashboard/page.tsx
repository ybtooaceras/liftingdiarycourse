"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockWorkouts = [
  {
    id: 1,
    name: "Bench Press",
    sets: [
      { reps: 8, weight: "80kg" },
      { reps: 8, weight: "80kg" },
      { reps: 6, weight: "82.5kg" },
      { reps: 6, weight: "82.5kg" },
    ],
  },
  {
    id: 2,
    name: "Squat",
    sets: [
      { reps: 10, weight: "100kg" },
      { reps: 10, weight: "100kg" },
      { reps: 8, weight: "105kg" },
    ],
  },
  {
    id: 3,
    name: "Deadlift",
    sets: [
      { reps: 5, weight: "120kg" },
      { reps: 5, weight: "120kg" },
      { reps: 5, weight: "125kg" },
    ],
  },
]

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Date Picker */}
          <Card className="shrink-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Workout List */}
          <div className="flex-1 space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Workouts for{" "}
              <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                {format(date, "do MMM yyyy")}
              </span>
            </h2>

            {mockWorkouts.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-zinc-400">
                  No workouts logged for this date.
                </CardContent>
              </Card>
            ) : (
              mockWorkouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        {workout.name}
                      </CardTitle>
                      <Badge variant="secondary">
                        {workout.sets.length} sets
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {workout.sets.map((set, i) => (
                        <span
                          key={i}
                          className="text-sm text-zinc-500 dark:text-zinc-400"
                        >
                          {set.reps} × {set.weight}
                          {i < workout.sets.length - 1 && (
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
