# Data Fetching Standards

## Rule: Server Components Only

**All data fetching MUST be done exclusively via React Server Components.**

This means:
- **NO** fetching data in Client Components (`"use client"`)
- **NO** fetching data in Route Handlers (`src/app/api/`)
- **NO** `useEffect` + `fetch` patterns
- **NO** SWR, React Query, or similar client-side data fetching libraries
- **NO** raw `fetch()` calls to internal API routes

Data flows in one direction: database → server component → (props) → client component.

If a Client Component needs data, it must receive it as props from a parent Server Component.

## Rule: All Database Queries Go Through `/data` Helpers

**All database queries MUST be made via helper functions located in the `/data` directory.**

Do not write database queries inline inside components or anywhere outside of `/data`. Every query must live in a dedicated helper function.

```
src/
  data/
    workouts.ts     # e.g. getWorkouts(), getWorkoutById()
    exercises.ts    # e.g. getExercises()
    sets.ts         # e.g. getSetsForWorkout()
```

### Helper Function Rules

- Use **Drizzle ORM** exclusively. **Never write raw SQL.**
- Every helper function that queries user-owned data **MUST scope the query to the currently authenticated user**.
- Always call `auth()` from `@clerk/nextjs/server` inside the helper to get the current `userId`.
- If `userId` is `null` (unauthenticated), throw an error immediately — do not return data.

### Example

```ts
// src/data/workouts.ts
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getWorkouts() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
}
```

### Using a Helper in a Server Component

```tsx
// src/app/workouts/page.tsx
import { getWorkouts } from "@/data/workouts"

export default async function WorkoutsPage() {
  const workouts = await getWorkouts()

  return (
    <ul>
      {workouts.map((w) => (
        <li key={w.id}>{w.name}</li>
      ))}
    </ul>
  )
}
```

## Security Requirement: User Data Isolation

Every query against a user-owned table **MUST** filter by `userId`. A logged-in user must never be able to read, modify, or delete another user's data.

Checklist for every helper function:
1. Call `auth()` to retrieve `userId`
2. Throw immediately if `userId` is falsy
3. Include `eq(table.userId, userId)` (or equivalent) in every query
4. Never accept a `userId` as a parameter from the caller — always derive it from `auth()` inside the function

Accepting `userId` as a parameter is dangerous because it allows callers to pass an arbitrary ID. Always source `userId` from the server-side `auth()` call.
