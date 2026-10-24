# Features Report

Source: `.devin/features/<workspace>/index.ts` · Scope: [...] · Date: [...]

| No. | Workspace | Feature | Description | Why | Solutions | Module | Route | API | DB | Topics | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `1` | `...` | `...` | `...` | `...` | `...` | `...` | `...` | `...` | `...` | `...` | `✅ active` |

## Fill Rules

- One row per feature in `allFeatures`; group by workspace first, then by module; `No.` runs continuously 1..N.
- `Description`, `Why`, `Solutions`, `Module` are copied from the `types.ts` Feature interface of that workspace — never invented.
- `Route`, `API`, `DB`, `Topics` are optional: show only when present in the workspace manifest, else leave empty.
- `Status` uses symbols: `✅ active`, `⚠️ partial`, `❌ deprecated`; within a group sort `active` first, `partial` next, `deprecated` last.
- Below the table add the summary: feature count per workspace and per status, `partial`/`deprecated` listed as a separate group.
- Workspaces without feature files are noted in the summary, not given empty rows.
