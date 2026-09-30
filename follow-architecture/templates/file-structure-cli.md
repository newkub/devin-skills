# CLI File Structure

Canonical file structure สำหรับ CLI tool — thin command layer + domain services + IO adapters

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
│  ├─ usecases/                           # application use cases — 1 file ต่อ command group (domain)
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
| 1 | presentation | `bin.ts`+`commands/`+`ui/` | argv parsing, handlers, terminal output | → `usecases/` (+ leaves) — ห้ามเรียก `infra/` ตรง |
| 2 | domain | `usecases/`+`services/` | orchestration + rules | → `infra/` (+ leaves) |
| 3 | data | `infra/`+`lib/` | fs/http/process IO | leaf (+ leaves) |
| 4 | shared leaf | `utils/`+`types/`+`constants/`+`config/` | pure/shared | leaf — ทุก layer ใช้ได้ |

## Rules

- `commands/*` thin — parse args + call usecase + render via `ui/`; business rules ห้ามอยู่ใน handler
- Exit codes centralized ที่ `errors.ts` — commands return result, `bin.ts` ตัดสิน exit code
- stdout ผ่าน `ui/` เท่านั้น — ห้าม `console.log` ใน domain/data layers (ใช้ stderr logger ใน `lib/`)
- `utils/`/`services/` pure — testable โดยไม่ mock process
- ถ้า CLI เป็น entry point หนึ่งของหลาย (api+worker+cron) → ใช้ Clean (`templates/file-structure-clean.md`) — `app/cli/` เป็น thin shell เหนือ `modules/`
