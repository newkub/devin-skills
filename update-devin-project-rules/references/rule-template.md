# `.devin/rules/` Markdown Rule Template

Natural-language rules the Devin CLI loads for every agent session. Distinct from ast-grep `rules/*.yml` (machine-enforced AST patterns). One concern per file, `kebab-case`, ≤250 lines, English.

## Frontmatter + body

```markdown
---
description: One line — when/why this rule applies; used to decide relevance
globs: Comma-separated file globs this rule targets, or empty for all files
alwaysApply: true or false
---

# Rule title

The convention, stated imperatively. Reference tools/commands/paths/skills with backticks.

## Applies to

- workspace, folder, or paths this rule governs

## Do

- positive, concrete guidance

## Don't

- banned patterns, imports, or practices — each with the reason or the preferred alternative

## Source

- the manifest, `AGENTS.md`, file, or doc this rule is derived from
```

Field notes:

- `alwaysApply: true` — architecture/business rules that govern every session
- `alwaysApply: false` + `globs` + a precise `description` — narrower rules pulled in only for matching files (e.g. `globs: "**/*.test.ts"`)
- `description` must be specific enough that relevance can be decided without opening the body

## Workspace-type folders

Create one folder per workspace type under `architecture/`. Detect types from `/check-monorepo` + the manifests; common values:

| Type | Folder | Typical signal |
|------|--------|----------------|
| Web / frontend | `architecture/web/` | `vite`/`next`/`nuxt`/`solid` deps, `src/` with components |
| API / backend | `architecture/api/` | server framework (`elysia`, `hono`, `express`), routes |
| CLI | `architecture/cli/` | `bin`, command framework, terminal entry |
| Mobile | `architecture/mobile/` | `capacitor`, KMP, native targets |
| Desktop | `architecture/desktop/` | `tauri`, native-sdk |
| Docs | `architecture/docs/` | `vitepress`, `docs/` site |
| Library / package | `architecture/lib/` | published `exports`, `tsdown`/`bunup` build |

## Example — architecture rule

```markdown
---
description: Layering rules for the web workspace — UI imports domain, never the reverse
globs:
alwaysApply: true
---

# Web Layering

The web app follows the Layered pattern chosen in `AGENTS.md`. Keep dependency direction inward.

## Applies to

- `apps/web/src/**`

## Do

- Import shared state from `@/store` and data from `@/api`
- Put route files under `src/routes/` and page components under `src/routes/+`
- Validate forms at the boundary with `zod` schemas in `src/lib/validation/`

## Don't

- Do not import from a sibling feature folder — go through the feature's barrel
- Do not call `fetch` directly in components — use the `@/api` client
- Do not place business logic in `.tsx` files — extract to `src/lib/`

## Source

- `AGENTS.md` (Layered architecture), `apps/web/package.json`
```

## Example — dependencies rule

```markdown
---
description: Use `dayjs` for dates; `moment` is banned
globs: "**/*.{ts,tsx,js,jsx}"
alwaysApply: false
---

# Date Library

## Do

- Use `dayjs` (already a dependency) for all date parsing/formatting

## Don't

- Do not add or import `moment` — it is banned (bundle size); prefer `dayjs`

## Source

- Root `package.json` dependencies
```

## Example — business rule

```markdown
---
description: Order totals are computed server-side; the client never trusts a client total
globs:
alwaysApply: true
---

# Order Totals

## Do

- Compute `total`, tax, and discounts only in the API pricing service
- Treat any client-sent total as display-only

## Source

- `FEATURES.md` (pricing), `services/pricing/`
```
