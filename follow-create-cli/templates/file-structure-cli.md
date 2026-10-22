# CLI File Structure

Canonical file structure for a CLI tool — thin command layer + domain services + IO adapters

## File Structure

```text
project/
│
├─ src/
│  ├─ bin.ts                              # entry — parse argv, wire deps, dispatch
│  │
│  ├─ commands/                           # command handlers — thin, argv→usecase (presentation)
│  │  ├─ index.ts                         # command registry/tree
│  │  ├─ user.ts                          # user create|list|delete subcommands
│  │  └─ migrate.ts
│  │
│  ├─ ui/                                 # terminal rendering — prompts, tables, spinners (presentation)
│  │  ├─ prompt.ts
│  │  └─ table.ts
│  │
│  ├─ usecases/                           # application use cases — 1 file per command group (domain)
│  │  ├─ create-user.ts
│  │  └─ run-migration.ts
│  │
│  ├─ services/                           # business rules — pure (domain)
│  │  └─ plan-migration.ts
│  │
│  ├─ infra/                              # IO — fs, http, process exec, config files (data)
│  │  ├─ fs.ts
│  │  ├─ http.ts
│  │  └─ store.ts                         # local state/config persistence
│  │
│  ├─ lib/                                # third-party singletons — parser, logger (data)
│  │
│  ├─ utils/ types/ constants/ config/    # shared leaves (pure)
│  │
│  └─ errors.ts                           # exit codes + error types
│
├─ tests/
│  ├─ unit/                               # usecases/, services/, utils/
│  └─ e2e/                                # spawn binary, assert stdout/exit code
├─ package.json                           # "bin": { "<name>": "dist/bin.js" }
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `bin.ts`+`commands/`+`ui/` | argv parsing, handlers, terminal output | → `usecases/` (+ leaves) — never call `infra/` directly |
| 2 | domain | `usecases/`+`services/` | orchestration + rules | → `infra/` (+ leaves) |
| 3 | data | `infra/`+`lib/` | fs/http/process IO | leaf (+ leaves) |
| 4 | shared leaf | `utils/`+`types/`+`constants/`+`config/` | pure/shared | leaf — usable by every layer |

## Rules

- `commands/*` thin — parse args + call usecase + render via `ui/`; business rules must not live in the handler
- Exit codes centralized in `errors.ts` — commands return result, `bin.ts` decides the exit code
- stdout only through `ui/` — never `console.log` in domain/data layers (use a stderr logger in `lib/`)
- `utils/`/`services/` pure — testable without mocking the process
- If the CLI is one entry point among several (api+worker+cron) → use Clean (`follow-architecture/references/clean-arch.md`) — `app/cli/` as a thin shell over `modules/`
