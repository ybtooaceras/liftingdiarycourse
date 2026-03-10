# Data Mutation Standards

## Rule: All Database Mutations Go Through `/data` Helpers

**All database mutations MUST be made via helper functions located in the `/data` directory.**

Do not write database mutation calls (insert, update, delete) inline inside server actions, components, or anywhere outside of `/data`. Every mutation must live in a dedicated helper function.

```
src/
  data/
    workouts.ts     # e.g. createWorkout(), deleteWorkout()
    exercises.ts    # e.g. createExercise()
    sets.ts         # e.g. createSet(), updateSet(), deleteSet()
```

### Helper Function Rules

- Use **Drizzle ORM** exclusively. **Never write raw SQL.**
- Every helper function that mutates user-owned data **MUST scope the operation to the currently authenticated user**.
- Always call `auth()` from `@clerk/nextjs/server` inside the helper to get the current `userId`.
- If `userId` is `null` (unauthenticated), throw an error immediately — do not perform the mutation.
- Never accept a `userId` as a parameter from the caller — always derive it from `auth()` inside the function.

### Example

```ts
// src/data/workouts.ts
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createWorkout(name: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const [workout] = await db
    .insert(workouts)
    .values({ name, userId })
    .returning()

  return workout
}

export async function deleteWorkout(workoutId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
}
```

## Rule: All Mutations Are Triggered via Server Actions

**All data mutations MUST be performed via Next.js Server Actions.**

This means:
- **NO** mutation logic inside Client Components
- **NO** Route Handlers (`src/app/api/`) for mutations
- **NO** inline `"use server"` functions inside component files

Server actions must be defined in colocated `actions.ts` files, placed alongside the route they serve.

```
src/
  app/
    workouts/
      page.tsx
      actions.ts    # server actions for the workouts route
    workouts/[id]/
      page.tsx
      actions.ts    # server actions for the workout detail route
```

## Rule: Server Action Parameters Must Be Typed — No `FormData`

**Server action parameters must use explicit TypeScript types.**

- **NO** `FormData` as a parameter type
- Define a specific type or inline type for every parameter
- Parameters should reflect the exact shape of data the action needs

```ts
// WRONG — do not use FormData
export async function createWorkout(data: FormData) { ... }

// CORRECT — use explicit typed parameters
export async function createWorkout(name: string) { ... }
export async function updateSet(setId: string, reps: number, weight: string) { ... }
```

## Rule: All Server Actions Must Validate Arguments with Zod

**Every server action MUST validate its arguments using [Zod](https://zod.dev/) before performing any operation.**

- Define a Zod schema for every action's input
- Call `.parse()` or `.safeParse()` at the top of the action before any logic
- Never trust caller-supplied data without validation

### Example

```ts
// src/app/workouts/actions.ts
"use server"

import { z } from "zod"
import { createWorkout } from "@/data/workouts"

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
})

export async function createWorkoutAction(name: string) {
  const { name: validatedName } = createWorkoutSchema.parse({ name })

  return createWorkout(validatedName)
}
```

```ts
// src/app/workouts/[id]/actions.ts
"use server"

import { z } from "zod"
import { updateSet } from "@/data/sets"

const updateSetSchema = z.object({
  setId: z.string().uuid(),
  reps: z.number().int().positive(),
  weight: z.string().min(1),
})

export async function updateSetAction(setId: string, reps: number, weight: string) {
  const validated = updateSetSchema.parse({ setId, reps, weight })

  return updateSet(validated.setId, validated.reps, validated.weight)
}
```

## Rule: No `redirect()` Inside Server Actions — Redirect Client-Side

**Never call `redirect()` from `next/navigation` inside a server action.**

Server actions must return data (or throw), and the calling Client Component is responsible for navigating after the action resolves.

```ts
// WRONG — do not redirect inside a server action
export async function createWorkoutAction(name: string) {
  await createWorkout(name)
  redirect("/dashboard") // ❌
}

// CORRECT — return and let the client redirect
export async function createWorkoutAction(name: string) {
  return createWorkout(name) // ✅
}
```

In the Client Component, use the `useRouter` hook to navigate after `await`ing the action:

```tsx
"use client"

import { useRouter } from "next/navigation"
import { createWorkoutAction } from "../actions"

export function NewWorkoutForm() {
  const router = useRouter()

  async function handleSubmit() {
    await createWorkoutAction(name)
    router.push("/dashboard") // ✅ redirect happens client-side
  }
}
```

## Security Requirement: User Data Isolation

Every mutation against a user-owned table **MUST** be scoped to the authenticated user. A logged-in user must never be able to modify or delete another user's data.

Checklist for every `/data` mutation helper:
1. Call `auth()` to retrieve `userId`
2. Throw immediately if `userId` is falsy
3. Include `eq(table.userId, userId)` (or equivalent) in every write/delete query
4. Never accept a `userId` as a parameter from the caller — always derive it from `auth()` inside the function

## Summary

| Concern | Location | Rules |
|---|---|---|
| DB mutation logic | `src/data/*.ts` | Drizzle ORM only, scoped to `userId` from `auth()` |
| Triggering mutations | `actions.ts` colocated with route | `"use server"`, no `FormData`, Zod validation required |
