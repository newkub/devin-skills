# Layered Pattern

> When: a single deployable with one bounded context — thin rules, UI-driven or CRUD-shaped, few stable external integrations (see `SKILL.md` `### 2` rows 3 and 5). Folders grouped by type; layers point one way down: `presentation` → `domain` → `data`, no bypass
>
> Relationship: Layered is Clean collapsed to a single bounded context — the same dependency rule at lower boundary granularity. Promote to Clean ([clean-arch](clean-arch.md)) when ≥2 entry points share the domain, a second bounded context appears, or an external system turns volatile enough to need ports. Demote from Clean only when the contexts genuinely collapse to one and no port has a second implementation — re-evaluate at `SKILL.md` `### 1`, never big-bang one pattern into the other.
>
> The tree below is a greenfield default, on the same rule as Clean: an owner skill's template wins for its stack (see `SKILL.md` `## File Structure By Workspace Type`), and this section's direction plus Rules are what carry over.

## Restructure

1. Prepare: `/scan-codebase` the target — routes/pages, business logic, data access; identify the public API and route entry points to preserve
2. Map folders: presentation → `app/`+`components/`+`hooks/`; domain → `usecases/`+`services/`+`features/`; data → `infra/`+`lib/`; shared leaves → `types/`+`constants/`+`utils/`+`config/`
3. Create the type-grouped folders below, each file prefixed with its domain (`user-service.ts`); one type-folder past 10–15 files groups into `<type>/<domain>/` (the threshold `/refactor` `### 3` item 3 uses) rather than being left flat; move one batch at a time
4. Enforce dependencies: presentation → domain → data only; `app/` calls `usecases/`/`features/` only; public API through the `index` barrel; align tests per layer
5. Verify: no layer bypass (e.g. `components/` calling `infra/` directly), no cross-layer deep imports; run `/run-check` + the tests

## File Structure

```text
src/
├─ app/          # routes/pages, middleware, server.ts — presentation, required
├─ components/   # UI components, PascalCase — presentation, if UI
├─ hooks/        # hooks / composables — presentation, if UI
├─ usecases/     # orchestration entries — login.ts, create-order.ts — domain, required
├─ services/     # *-service.ts — business rules, no IO performed — domain, required
├─ features/     # feature logic composing services — domain, optional
├─ infra/        # repositories, database/, external APIs — data, required
├─ lib/          # third-party wrappers / singleton clients — data, optional
├─ types/ constants/ utils/ config/   # shared leaves — pure, no IO, never import back
└─ index.ts      # barrel — public API
tests/               # unit/ integration/ e2e/ — where the project already puts them
scripts/  docs/  package.json  tsconfig.json  README.md  .env.example
```

## Layer Table

| No. | Layer | Folder | Contains | Required | Deps |
|-----|-------|--------|----------|----------|------|
| 1 | presentation | `app/` | routes/pages, middleware, `server.ts` | required | → `usecases/`, `features/` + shared leaves |
| 2 | presentation | `components/` | UI components — PascalCase, presentational | if UI | → `hooks/`, `usecases/` + shared leaves — never `infra/`/`lib/` |
| 3 | presentation | `hooks/` | hooks / composables — UI state + view logic | if UI framework | → `usecases/` + shared leaves |
| 4 | domain | `usecases/` | orchestration entries (`login.ts`, `create-order.ts`) | required | → `services/`, `features/`, `infra/` + shared leaves |
| 5 | domain | `services/` | `*-service.ts` — business rules, no IO performed | required | → `infra/`, `lib/` through their interfaces + shared leaves — never presentation |
| 6 | domain | `features/` | feature-level logic composing services | optional | → `services/` + shared leaves — never `usecases/` |
| 7 | data | `infra/` | repositories, `database/`, external APIs | required | shared leaves only — bottom layer |
| 8 | data | `lib/` | third-party wrappers / singleton clients | optional | shared leaves only |
| 9 | shared leaf | `types/` | shared types — pure types only | optional | leaf — never import back |
| 10 | shared leaf | `constants/` | constants | optional | leaf — usable by every layer |
| 11 | shared leaf | `utils/` | pure utilities — no IO | optional | leaf — usable by every layer |
| 12 | shared leaf | `config/` | `env.ts`, `app.ts`, `database.ts` | optional | leaf — usable by every layer |
| 13 | root | `index.ts` | barrel — public API | required | → every layer |

## Rules

- Group by type, not by capability — the file name carries the domain (`user-service.ts`, `order-service.ts`); a type-folder past 10–15 files groups into `<type>/<domain>/` (the same threshold `/refactor` `### 3` item 3 uses), never a top-level feature tree
- Dependencies point one way down: presentation → domain → data — no bypassing and never pointing up; `app/` calls `usecases/`/`features/` only, never `services/`/`infra/` directly when a usecase wraps them
- `types/`, `constants/`, `utils/`, `config/` are leaves — every layer may import them, they never import back into layer folders; `utils/` + `types/` stay pure (no IO, framework imports, side effects)
- Public API through the `index.ts` barrel — no deep imports across layers; use the project's path aliases instead of cross-folder relative imports
- Preserve existing behavior — routes/pages work exactly as before the restructure
- Folder names alone are not architecture — keep the direction enforced by import rules (`/update-astgrep-rules`) and prove it with `/follow-tool-madge` (no circular) + `/deep-review` dimension `architecture`
