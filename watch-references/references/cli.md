# CLI Reference

`watch-ref` runs from the project root. Every command accepts `--root <dir>`, `--json`, and `--help`.

Exit codes: `0` ok, `1` runtime or check failure, `2` usage or config error.

## Command Tree

- `watch-ref init [--force] [--quiet]` — writes `watch-references.json` unless one exists, then scans.
- `watch-ref scan [--force]` — one full incremental scan; `--force` re-parses unchanged files.
- `watch-ref watch [--once] [--force] [--debounce ms] [--interval ms]` — long-running poller; `--once` scans and exits.
- `watch-ref serve [--no-watch]` — stdio MCP server; watches unless `--no-watch` is passed.
- `watch-ref status` — config path, state, counts, watcher health, lock owner, ast-grep version.
- `watch-ref search <query> [--category c] [--file path] [--limit n]` — text search over the index.
- `watch-ref inspect <name|file|id>` — one reference in full, or a match table.
- `watch-ref check [name...]` — runs `checks[]` from the config; non-zero on any failure.
- `watch-ref references [list|show <category>] [--limit n]` — category counts or references in a category.
- `watch-ref feedback <list|show|create|update|fix|apply|verify> [...]`
- `watch-ref screen <list|capture|ingest|prune> [...]`
- `watch-ref videos <list|capture|ingest|prune> [...]`
- `watch-ref runtime <list|capture|prune> [...]`
- `watch-ref dev <start|stop|restart|status|logs|ensure|detect> [...]`
- `watch-ref skills <generate|validate>`
- `watch-ref help [command]`

An unknown flag fails with exit `2` and names the command, for example `unknown flag --tag for "search"`. An unknown action fails with `unknown <command> action "..." (expected ...)`.

## Scan And Watch

| Flag | Command | Meaning |
| --- | --- | --- |
| `--force` | `init`, `scan`, `watch --once` | Ignore content hashes and re-parse every file |
| `--quiet` | `init`, `scan`, `watch` | Suppress human-readable output |
| `--once` | `watch` | Scan, print the summary, exit |
| `--debounce ms` | `watch` | Quiet period before a flush; default from `watch.debounceMs` |
| `--interval ms` | `watch` | Poll interval; default from `watch.pollIntervalMs` |

Statistics printed by `init`, `scan`, and `watch --once`: `files`, `changed`, `reused`, `removed`, `references`, `diagnostics`, `durationMs`, `astgrep`, `error`.

## Queries

| Command | Selection order |
| --- | --- |
| `inspect` | reference id, exact name, file or file prefix, then name substring |
| `search` | name, kind, excerpt, and file, case-insensitive |
| `references show` | one category, capped by `--limit` (default 200) |

`status` prints `state` as `uninitialized` when no status file exists. `astgrep` is `null` when the binary is missing; the scan still writes an index but skips code categories.

## Feedback

- `feedback list [--status s]`
- `feedback show <id>`
- `feedback create --category c --description text [--locations a,b] [--refs id1,id2]`
- `feedback update <id> [--status s] [--description text] [--locations a,b]`
- `feedback fix <id> --ops '<json>' [--scope a,b]` — saves a plan, changes nothing.
- `feedback apply <id> --yes` — applies the saved plan.
- `feedback verify <id>` — runs checks and re-scans; exit `0` only when the record becomes `verified`.

`--ops` accepts either an array of ops or `{ "ops": [...], "scope": [...] }`. One op:

```json
{ "file": "src/app.ts", "startLine": 3, "endLine": 3, "expectedText": "export const answer = 41", "replacement": "export const answer = 42" }
```

`apply` exits `2` without `--yes`, when a plan op falls outside `scope`, or when the file text no longer matches `expectedText`. Ops in one file are applied bottom-up so earlier line numbers stay valid.

## Evidence

- `screen capture <label> [--command cmd]`
- `screen ingest <file> --label name`
- `videos capture <label> [--command cmd]`
- `videos ingest <file> --label name`
- `runtime capture <file> --label name`
- `<screen|videos|runtime> list`
- `<screen|videos|runtime> prune [--days n] [--apply]`

A capture command runs with `WATCH_REF_ROOT`, `WATCH_REF_EVIDENCE_PATH`, and `WATCH_REF_EVIDENCE_KIND` set. It must write the path in `WATCH_REF_EVIDENCE_PATH`; a non-zero exit or a missing file fails the capture. `ingest` and `runtime capture` copy an existing artifact from inside the project. `prune` is a dry run unless `--apply` is passed, and retention `0` removes nothing.

## Dev Server

- `dev detect` — prints the detected command; exit `1` when none is found.
- `dev start [--command cmd] [--cwd dir]` — spawns detached; reports `started` or `reused`.
- `dev ensure [--command cmd] [--cwd dir]` — starts only when no live process exists.
- `dev status` — exit `0` while running, `1` when stopped.
- `dev logs [--lines n]` — tail of the managed log, default 80.
- `dev restart`, `dev stop` — one session only.

Detection order: `dev.command` in config, then the first of `dev`, `start`, `serve`, `watch` in `package.json` scripts run through the lockfile's package manager, then `cargo run`.

## Skills

- `skills generate` — writes the three guides under `.watch-references/skills`.
- `skills validate` — checks frontmatter, section order, the 250-line limit, related links, and every tool name in `Tool list:`.

`skills validate` exits `1` when any guide has an issue and prints a table of `skill`, `code`, `message`.
