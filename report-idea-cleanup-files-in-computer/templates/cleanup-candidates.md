# Cleanup Candidates Report

Scope: `[home | temp | caches | all]` · OS/shell: `[...]` · Date: `[...]`

| No. | Category | Path/Pattern | Estimated Size | Safety | Suggested Command | Notes |
|---|---|---|---|---|---|---|
| `1` | `package cache` | `[...]` | `~[.. MB]` | `safe` | `scoop cleanup *` | `[why + how sized]` |

## Fill Rules

- `No.` runs 1..N; group rows by `Category` (package cache, temp, logs, editor cache, browser cache, old artifacts), largest reclaim first.
- `Safety` is one of `safe` / `review` / `risky`; `risky` = config-related or may hold data — never source, `.env`, secrets.
- `Estimated Size` is approximate; state how it was computed in `Notes`.
- `Suggested Command` must be the tool's own cleanup command where available (e.g. `mise prune`, `bun pm cache clean`), matched to the detected OS shell.
- A cache held by a running process is not `safe` — mark it `review` and say so in `Notes`.
- Report only: nothing is deleted; `No.`/commands are shown for the user to approve first.
- After the table add the summary: candidate count, total reclaimable size, `safe` items, items needing review.
