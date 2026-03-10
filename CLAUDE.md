# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Docs-First Requirement

**Before generating any code, Claude Code MUST first check the `/docs` directory for relevant documentation.** If a docs file exists for the technology, feature, or pattern being implemented, follow its guidance exactly. The `/docs` directory is the authoritative source for conventions and patterns used in this project.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 app using the App Router (`src/app/`), React 19, TypeScript, and Tailwind CSS v4.

- `src/app/layout.tsx` — Root layout with Geist font setup and global metadata
- `src/app/page.tsx` — Home page (entry point for the app)
- `src/app/globals.css` — Global styles (Tailwind base)

New routes are added as directories under `src/app/` following Next.js App Router conventions (e.g., `src/app/workouts/page.tsx`).

ESLint is configured with `eslint-config-next` (core-web-vitals + TypeScript rules).

## Authentication (Clerk)

Clerk is integrated via `@clerk/nextjs`. Keys are stored in `.env.local` (excluded from git).

- **`src/middleware.ts`** — `clerkMiddleware()` from `@clerk/nextjs/server` runs on all routes
- **`src/app/layout.tsx`** — `<ClerkProvider>` wraps the app; header uses `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<SignUpButton>`, `<UserButton>`

Import client components from `@clerk/nextjs`, server utilities (e.g., `auth()`) from `@clerk/nextjs/server` using `async/await`.
