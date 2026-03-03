# UI Coding Standards

## Component Library

**Only shadcn/ui components are permitted in this project.**

Do not create custom UI components. Every UI element — buttons, inputs, dialogs, cards, tables, badges, dropdowns, etc. — must use the shadcn/ui component library. If a shadcn/ui component exists for a given use case, use it.

To add a component:

```bash
npx shadcn@latest add <component-name>
```

Components are installed into `src/components/ui/` and can be imported from there:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/).

Use the format string `"do MMM yyyy"` to produce ordinal day, abbreviated month, and 4-digit year:

```ts
import { format } from "date-fns"

format(new Date("2025-09-01"), "do MMM yyyy") // 1st Sep 2025
format(new Date("2025-08-02"), "do MMM yyyy") // 2nd Aug 2025
format(new Date("2026-01-03"), "do MMM yyyy") // 3rd Jan 2026
format(new Date("2024-06-04"), "do MMM yyyy") // 4th Jun 2024
```

This format must be used consistently everywhere a date is displayed in the UI.
