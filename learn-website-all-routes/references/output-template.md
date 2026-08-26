# Website Routes Reference

## Page Routes

| No | Path | File | Parameters | Notes |
|----|------|------|------------|-------|
| 1 | `/` | `src/routes/index.tsx` | - | home |
| 2 | `/about` | `src/routes/about.tsx` | - | public |
| 3 | `/users/[id]` | `src/routes/users/[id].tsx` | `id` | requires auth |

## API Routes

| No | Method | Path | File | Parameters | Notes |
|----|--------|------|------|------------|-------|
| 1 | GET | `/api/users` | `src/routes/api/users.ts` | - | list users |
| 2 | POST | `/api/users` | `src/routes/api/users.ts` | - | create user |
| 3 | GET | `/api/users/[id]` | `src/routes/api/users/[id].ts` | `id` | get user |

## Dynamic Patterns

- `/users/[id]` — single parameter
- `/posts/[...slug]` — catch-all slug
- `/(group)/profile` — route group, URL ไม่มี group

## Authentication Required

- `/users/[id]`
- `/settings`
- `/admin/*`

## Redirects And Catch-all

- `/old-path` → `/new-path`
- `/*` → `404` page
