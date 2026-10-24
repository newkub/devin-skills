---
name: watch-references
description: Index a project's code so agents can search symbols, cite locations, and track changes
argument-hint: "[init|scan|watch|serve|status|search|inspect|check|references|feedback|screen|videos|runtime|dev|skills] [...]"
related:
  - code-search
  - deep-test
  - check-skills-structure
  - check-agents-lint
  - update-agents-skills-global
---

## Goal

Keep a persistent index of a project's code with provenance, so an agent can search a symbol, cite its exact file and line range, and see what a change affected without re-reading the tree.

## Scope

One project root that contains `watch-references.json`. All state lives under `.watch-references/`. The implementation is this Bun package: extractors in `src/`, the CLI at `src/cli.ts`, the MCP server at `src/mcp.ts`, and the test suite at `tests/core.test.ts`.

Three surfaces:
- `watch-ref` for setup, scans, queries, feedback, evidence, and the managed dev server.
- `watch-ref serve` for the same index and tools over stdio MCP.
- Generated guides under `.watch-references/skills` for agents that drive the MCP server.

Boundaries:
- Ad-hoc text or AST search that must not persist state is `code-search`.
- Test execution and test domains are `deep-test`; this package only indexes and verifies.
- Skill-package structure is validated by `check-skills-structure` and `check-agents-lint`.
- Creating or changing any skill follows `update-agents-skills-global`.

## Execute

### 1. Initialize The Project

> Goal: Create the config and a first complete index.

1. Run `watch-ref init` from the project root. It writes a minimal `watch-references.json` (defaults stay in code) and runs a full scan; it refuses to overwrite an existing config unless `--force` is passed.
2. Confirm with `watch-ref status --json`: `initialized` is true, `files` and `references` are non-zero, and `astgrep` is not null.
3. If `astgrep` is null, code categories were skipped. Install ast-grep and re-run `watch-ref scan --force`.

### 2. Keep The Index Current

> Goal: Make queries reflect the files on disk without a manual re-scan.

1. Run `watch-ref watch` in a long-lived shell. It polls filtered file signatures, re-parses only changed files, and holds `.watch-references/watch.lock` so two watchers cannot corrupt the index.
2. Use `watch-ref watch --once` for CI or one-shot use. A single failed write is tolerated; the watcher reports `error` only after three consecutive failures and recovers on the next successful flush.
3. `watch-ref serve` starts its own watcher by default. Pass `--no-watch` when another process already runs `watch-ref watch`.
4. Files under the output directory are ignored, so index writes never trigger another scan.

### 3. Find And Inspect References

> Goal: Return the exact location and provenance of what the agent is looking for.

1. `watch-ref search <query> [--category c] [--file path] [--limit n]` matches name, kind, excerpt, and file, case-insensitively.
2. `watch-ref inspect <name|file|id>` prefers an exact id, then an exact name, then a file prefix, then a substring match; multiple matches print a table with ids.
3. Over MCP, call `search_references`, `inspect_symbol`, or `reference_details`. Read `watchref://status` first; if `lastScanAt` is null, call `refresh_references` before searching.
4. After a change, call `affected_references` with the changed file to list references inside it plus architecture references that point at it.
5. A `diagnostic` reference means that file failed to parse or read. Fix the file and rescan; do not treat the diagnostic as content.

### 4. Record Feedback And Apply Authorized Fixes

> Goal: Track an observation, plan a fix, apply it only with authorization, and prove the result.

1. `watch-ref feedback create --category c --description text [--locations a,b] [--refs id1,id2]` records an observation. It never edits source.
2. `watch-ref feedback fix <id> --ops '<json>'` saves a plan and changes nothing. Each op carries `file`, `startLine`, `endLine`, `expectedText`, and `replacement`; an empty `replacement` deletes the lines.
3. `watch-ref feedback apply <id> --yes` applies the saved plan. It refuses without `--yes`, refuses an op outside `scope`, and refuses when the file text no longer equals `expectedText`.
4. `watch-ref feedback verify <id>` runs the configured checks and re-scans the touched files. The record becomes `verified` only when checks pass, the scan is clean, and at least one check is configured; otherwise it stays `fixed`.
5. Statuses are `open`, `accepted`, `fixed`, `verified`, `rejected`, and `wontfix`. MCP equivalents are `submit_feedback`, `request_fix`, `apply_fix`, and `verify_fix`.

### 5. Capture Evidence

> Goal: Attach real screenshots, recordings, and runtime logs to the project index.

1. Configure `visual.capture.screen` or `visual.capture.video`, or pass `--command`. The command must write the file named by `WATCH_REF_EVIDENCE_PATH`; a non-zero exit or a missing file fails the capture.
2. `watch-ref screen ingest <file> --label name` copies an existing artifact from inside the project and hashes it.
3. `watch-ref runtime capture <file> --label name` stores a runtime log or dump; it becomes a `runtime` reference.
4. `watch-ref screen prune --days n` is a dry run; add `--apply` to delete. Retention `0` (the default) deletes nothing.

### 6. Keep One Dev Server Session

> Goal: Reuse one managed server across agent calls instead of spawning duplicates.

1. `watch-ref dev detect` reports the command it would run; `watch-ref dev start` spawns it detached and `watch-ref dev ensure` reuses a live one.
2. `watch-ref dev status` exits non-zero when the process is gone, and `watch-ref dev logs --lines n` reads the tail of the managed log.
3. `watch-ref dev restart` stops and starts one session; `watch-ref dev stop` ends it.

### 7. Validate The Package

> Goal: Prove the index, the generated guides, and the package itself are sound.

1. Run `bun test tests` and `bun check -p . --no-script` in this folder.
2. Run `watch-ref skills generate` and `watch-ref skills validate`; validation checks frontmatter, section order, length, related links, and that every named tool exists.
3. Treat a failing check or a stale index as a failure, not a warning.

Detail references: [references/cli.md](references/cli.md), [references/mcp.md](references/mcp.md), [references/config.md](references/config.md), [references/data-model.md](references/data-model.md), [references/development.md](references/development.md).

## Rules

1. Never edit a file from a reference alone; read the file first.
2. Never invent a location. An empty result is a finding to report, not a prompt to guess.
3. Keep one `diagnostic` reference per parse or read failure; more than one means the extractor is duplicating.
4. Feedback must not modify source. A fix needs a saved plan, explicit authorization, a scope check, and an exact `expectedText` match.
5. Never claim a fix succeeded without a `verified` record or an explicit statement that verification did not run.
6. Evidence must come from a real run: no placeholder files, and no evidence pointing outside the project root.
7. Every path argument is project-relative and must stay inside the root; both the CLI and MCP reject an escape.
8. Do not put secrets in `watch-references.json`, evidence labels, or runtime artifacts.

## Expected Outcome

- A symbol lookup returns its exact file, line range, and provenance.
- A change is visible without a full rescan, and removed or renamed files leave no stale references or import edges.
- Feedback ends as a `verified` record backed by a passing check, or the report names the failing command.
- Generated guides validate, and every captured artifact is traceable to a label, hash, and timestamp.
