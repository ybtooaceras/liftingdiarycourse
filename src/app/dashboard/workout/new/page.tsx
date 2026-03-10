import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewWorkoutForm } from "./_components/NewWorkoutForm"

export default async function NewWorkoutPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
          New Workout
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Workout details</CardTitle>
          </CardHeader>
          <CardContent>
            <NewWorkoutForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
