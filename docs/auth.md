# Authentication Standards

## Auth Provider: Clerk

**This app uses [Clerk](https://clerk.com) exclusively for authentication.**

Do not implement custom auth, sessions, JWTs, or any other authentication mechanism. All auth must go through Clerk.

## Package Imports

Clerk exports are split across two packages depending on context:

| Context | Package |
|---|---|
| Client Components, layouts, UI components | `@clerk/nextjs` |
| Server Components, middleware, data helpers | `@clerk/nextjs/server` |

**Never import server utilities (`auth()`, `currentUser()`) from `@clerk/nextjs` — always use `@clerk/nextjs/server`.**

## Middleware

`src/middleware.ts` runs `clerkMiddleware()` on every request. Do not remove or modify this file without good reason.

```ts
// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## Provider Setup

`<ClerkProvider>` must wrap the entire app. It is already configured in `src/app/layout.tsx` — do not add it elsewhere.

## UI Components

Use Clerk's pre-built components for all auth-related UI. Do not build custom sign-in/sign-up forms.

```tsx
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
```

- `<SignedOut>` — renders children only when the user is **not** authenticated
- `<SignedIn>` — renders children only when the user **is** authenticated
- `<SignInButton mode="modal" />` — opens the Clerk sign-in modal
- `<SignUpButton mode="modal" />` — opens the Clerk sign-up modal
- `<UserButton />` — renders the authenticated user's avatar with account management

## Getting the Current User (Server-Side)

Use `auth()` from `@clerk/nextjs/server` to get the current `userId` in Server Components and data helpers. This call must be `await`ed.

```ts
import { auth } from "@clerk/nextjs/server"

const { userId } = await auth()
```

If `userId` is `null`, the user is unauthenticated. Always guard against this — throw an error rather than returning data.

```ts
const { userId } = await auth()

if (!userId) {
  throw new Error("Unauthorized")
}
```

Never accept `userId` as a parameter from a caller. Always derive it from `auth()` on the server.

## Route Protection

To protect a route so only authenticated users can access it, use `auth()` at the top of the Server Component and redirect if unauthenticated:

```tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  // render page...
}
```
