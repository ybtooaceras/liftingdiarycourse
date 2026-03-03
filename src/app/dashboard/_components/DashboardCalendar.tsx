"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCalendar({ selectedDate }: { selectedDate: Date }) {
  const router = useRouter()

  function handleSelect(d: Date | undefined) {
    if (!d) return
    const dateStr = format(d, "yyyy-MM-dd")
    router.push(`/dashboard?date=${dateStr}`)
  }

  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Select Date
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  )
}
