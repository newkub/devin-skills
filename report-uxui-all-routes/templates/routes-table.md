# All Routes Report

Source: [route files / route config / context given in the prompt]
Scope: [framework: Next.js / Nuxt / SvelteKit / SolidStart / Capacitor ...]
Date: [YYYY-MM-DD]

Key findings: [gaps, duplicates, routes needing verification]

| No. | Tab/Screen | Route | Method | Tab Group | Purpose | Primary Actions | Notes |
|---|---|---|---|---|---|---|---|
| 1 | `[screen name]` | `[url path]` | `[GET / POST / —]` | `[group name or standalone]` | `[one-line goal]` | `[Tap] [Toggle]` | `[state, loading, or edge case]` |

## Fill Rules

- `No.` is first and starts at 1; order rows by `Tab Group`, then `Route` alphabetically.
- Convert file paths to URL paths per the framework convention; `layout`, `error`, `loading`, `template` files are not routes.
- Keep dynamic segments in the framework's real notation (`[id]`, `[...slug]`, `(group)`); state the HTTP method per convention for API routes, `—` when not applicable.
- Every route carries a `Tab Group` (or `standalone`) and a short `Purpose`; `Primary Actions` uses `[]` for tap/click; `Notes` holds state, loading, or edge cases.
- Reference only routes that exist in the real codebase or the given context — never invent one; missing context → state the gap and use `/ask-me`.
- Use backticks for `route`, `method`, `paths`; `✅` `❌` `⚠️` for status.
