# Library File Structure

Canonical file structure for a library package (pure utils → domain lib) — flat modules + single barrel

## File Structure

```text
project/
│
├─ src/
│  ├─ index.ts                            # public API barrel — export only what is used externally
│  │
│  ├─ modules/                            # feature modules — 1 folder per capability
│  │  ├─ parser/
│  │  │  ├─ index.ts                      # module barrel — the module's public API
│  │  │  ├─ parse.ts                      # entry functions
│  │  │  ├─ ast.ts                        # internal types/logic — never exported outside the module
│  │  │  └─ options.ts
│  │  ├─ format/
│  │  │  ├─ index.ts
│  │  │  └─ format.ts
│  │  └─ validate/
│  │     ├─ index.ts
│  │     └─ rules.ts
│  │
│  ├─ types/                              # public shared types (shared leaf)
│  │  └─ index.ts
│  │
│  ├─ errors.ts                           # typed errors (shared leaf)
│  │
│  └─ utils/                              # internal pure helpers — not exported (shared leaf)
│     └─ internal.ts
│
├─ tests/
│  ├─ unit/                               # per-module tests
│  └─ api/                                # public API surface tests — import from index only
├─ package.json                           # exports map, types, sideEffects:false
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | public API | `index.ts` | barrel — re-export module APIs | → `modules/*/index`, leaves |
| 2 | domain | `modules/<name>/` | feature capability — barrel + internals | → other modules via barrel only (+ leaves) |
| 3 | shared leaf | `types/`+`errors`+`utils/` | public types + pure helpers | leaf — usable by every module |

## Rules

- Modules cross each other only through the `<module>/index.ts` barrel — no deep imports of internals
- `index.ts` exports only what the public API contract needs — internals must never leak (use the `exports` map + api-extractor/attw check)
- Every module is pure by default — side effects must be explicit (init function, opt-in)
- When the lib grows past the threshold (modules need ports/adapters, many external IO sources) → consider Clean (`follow-architecture/SKILL.md` `## Clean Pattern`)
- `sideEffects: false` + tree-shakable exports — no top-level side effects in `src/`
