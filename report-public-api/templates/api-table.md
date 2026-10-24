# Public API Report

Source: [`/scan-codebase` or `/check-code-structure` + barrel files (`index.ts`, `mod.rs`, `lib.rs`)]
Scope: [library / package / module]
Date: [YYYY-MM-DD]

Summary: [N] public exports — [K] deprecations, [B] breaking changes.

## API — [domain]

| No. | API | Type | Module | Description | Stability |
|---|---|---|---|---|---|
| 1 | `[exportedName]` | `[function]` | `[path/to/module]` | `[what it does, one line]` | `[stable]` |

## Fill Rules

- `No.` starts at 1 and is continuous across the whole report; repeat the `## API` table once per domain under a `## <domain>` heading.
- `API` is the public export name in backticks; list only public exports, never internals.
- `Type` ∈ function, class, type, interface, constant, enum, macro; add required params and return type when present.
- `Module` is the file that exports it.
- `Stability` ∈ stable, experimental, deprecated — stated explicitly on every row.
