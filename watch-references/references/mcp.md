# MCP Reference

`watch-ref serve` runs the stdio MCP server. It watches the project by default; pass `--no-watch` when another process already runs `watch-ref watch`. Diagnostics go to stderr only.

## Resources

| URI | Contents |
| --- | --- |
| `watchref://index` | Full index: files and every reference |
| `watchref://status` | State, counts, last scan, watcher health, lock owner, ast-grep |
| `watchref://categories` | Every category with its reference count |
| `watchref://changes` | The most recent change set only, not a history |
| `watchref://feedback` | All feedback records, newest first |
| `watchref://evidence` | Screen, video, and runtime evidence |
| `watchref://references/{category}` | All references in one category |

Read `watchref://status` first. When `lastScanAt` is null, call `refresh_references` before querying. An unknown category in the template returns a usage error naming the valid categories.

## Tools

### Index

| Tool | Input | Returns |
| --- | --- | --- |
| `search_references` | `query?`, `category?`, `file?`, `limit?` (max 500, default 50) | `{ query, count, references }` |
| `inspect_symbol` | `name`, `file?`, `limit?` (max 200, default 25) | `{ name, file, exact, count, references }` |
| `reference_details` | `id` | One reference with excerpt and provenance |
| `system_status` | none | Summary, `resources`, and `tools` |
| `refresh_references` | `force?` | `{ stats, changed }` |
| `affected_references` | `file` | `{ file, inside, dependents }` |
| `run_checks` | `checks?: string[]` | `{ passed, results }` |

`inspect_symbol` returns `exact: true` only when the name matches exactly; otherwise it returns case-insensitive substring matches.

`affected_references` lists references defined in the file plus every reference whose `category` is `architecture` and whose `meta.target` is that file. To see the dependents of a file, pass the target file, not the file that imports it.

### Feedback

| Tool | Input |
| --- | --- |
| `submit_feedback` | `category`, `description`, `locations?`, `reference_ids?` |
| `list_feedback` | `status?` |
| `get_feedback` | `id` — returns `{ record, fixPlan }` |
| `update_feedback` | `id`, `status?`, `description?` |
| `request_fix` | `feedback_id`, `scope?`, `ops[]` with `file`, `start_line`, `end_line`, `expected_text`, `replacement` |
| `apply_fix` | `feedback_id`, `authorize` |
| `verify_fix` | `feedback_id` — returns `{ status, verified, verification, results }` |

`submit_feedback` never modifies source. `request_fix` writes the plan and returns `{ plan, planPath }`; it also moves an `open` record to `accepted`. Nothing is applied until `apply_fix` is called with `authorize: true`, which validates every op and its scope before writing and refuses a mismatched `expected_text`. `verify_fix` sets `verified` only when checks pass, the re-scan is clean, and at least one check is configured.

### Evidence

| Tool | Input |
| --- | --- |
| `list_evidence` | `kind?` |
| `capture_screen` | `label`, `command?` |
| `capture_video` | `label`, `command?` |
| `ingest_evidence` | `kind` (`screen` or `video`), `source`, `label` |
| `capture_runtime` | `label`, `source` |
| `prune_evidence` | `days?`, `apply?` |

Capture tools run the command with `WATCH_REF_ROOT`, `WATCH_REF_EVIDENCE_PATH`, and `WATCH_REF_EVIDENCE_KIND` set; a non-zero exit or a missing file fails. `prune_evidence` is a dry run unless `apply: true`, and retention `0` deletes nothing.

### Dev Server And Guides

| Tool | Input | Returns |
| --- | --- | --- |
| `dev_status` | none | Process, log path, error-looking log lines |
| `dev_logs` | `lines?` (max 500, default 60) | `{ logPath, running, tail }` |
| `skills_generate` | none | `{ outDir, written }` |
| `skills_validate` | none | `{ issues }` |

The server keeps one dev session; it reuses a live process rather than starting a second one.

## Client Setup

Register a stdio server that runs `watch-ref serve` from the project root, for example with `bun run src/cli.ts serve` when the package is used directly. Add `--no-watch` when a separate watcher is already running. The tool list and resource list are stable; `system_status` returns both so a client can discover the surface at runtime.

## Error Shape

Tool failures return a text message and set `isError`. A missing reference, unknown category, or refused authorization is reported explicitly rather than returning an empty success.
