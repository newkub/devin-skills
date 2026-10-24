# Data Model Reference

The index is JSON on disk and is safe to read at any time. State files are replaced atomically, so a reader never sees a partial write.

## Index

```json
{
  "version": 1,
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "root": "D:/project",
  "files": { "src/app.ts": { "hash": "…", "language": "typescript", "bytes": 120, "refs": 3, "scannedAt": "…" } },
  "refs": []
}
```

`files` is the scan memory: a file is re-parsed only when its hash differs, it is a dependent of a removed file, or `--force` is used. A full scan drops a file record whose path no longer exists; a watched scan drops it when the path is reported removed.

## Reference

| Field | Meaning |
| --- | --- |
| `id` | Stable hash of category, file, line, name, and kind |
| `category` | One of the 15 categories below |
| `kind` | Parser node kind or a derived kind such as `screenshot` |
| `name` | Symbol name, config key, label, or file path |
| `file` | Project-relative POSIX path |
| `language` | Parser language, `config`, `meta`, or a file extension |
| `startLine`, `endLine` | 1-based inclusive range |
| `startColumn`, `endColumn` | 0-based columns |
| `excerpt` | Bounded source text for the range |
| `provenance` | Generator, captured time, source, and file hash |
| `meta` | Optional extra fields, for example `target` on architecture refs |

## Categories

| Category | Produced by | Content |
| --- | --- | --- |
| `variable` | ast-grep | Top-level bindings |
| `function` | ast-grep | Declarations and methods |
| `class` | ast-grep | Class declarations |
| `type` | ast-grep | Interfaces, aliases, enums |
| `import` | ast-grep | Import and require statements |
| `comment` | ast-grep | Comment nodes |
| `config` | derive | Keys from JSON, YAML, TOML, INI, and env files |
| `file` | derive | One reference for every indexed file |
| `symbol` | derive | Nested callables without module identity |
| `diagnostic` | derive | Exactly one per file that failed to parse or read |
| `architecture` | derive | Resolved relative imports, with `meta.target` |
| `change` | scan | Recent change entries, capped at 500 |
| `screen` | visual | Screenshot evidence |
| `video` | visual | Recording evidence |
| `runtime` | visual | Runtime log evidence |

Scanned categories exclude `screen`, `video`, and `runtime`; evidence refs are written by the evidence layer and never get a `FileRecord`, because a full scan treats an unlisted file as deleted.

## Provenance

`provenance.generator` is one of `watch-ref/astgrep`, `watch-ref/symbol`, `watch-ref/architecture`, `watch-ref/config`, `watch-ref/file`, `watch-ref/diagnostic`, `watch-ref/change`, or `visual`. `astgrepKind` is present for parser-derived refs, `fileHash` for anything tied to a file version, and `source` names the operation that produced it (`init`, `cli`, `watch`, `watch-once`, `mcp`, `verify`).

A `diagnostic` ref is the only honest signal that a file's refs may be stale. One per file is the contract; duplicates mean the extractor is emitting twice.

## Status

| Field | Meaning |
| --- | --- |
| `state` | `idle`, `scanning`, `watching`, or `error` |
| `initializedAt` | First successful initialization |
| `lastScanAt`, `lastChangeAt` | Timestamps of the last full scan and last change |
| `lastError` | Most recent watcher or scan error |
| `files`, `references` | Current counts |
| `watcher.healthy` | Running and fewer than three consecutive errors |
| `watcher.pending` | Files waiting for the debounce window |
| `watcher.ignored` | Changed paths inside the output directory |

The watcher becomes `error` only after three consecutive failures and returns to `watching` on a successful flush. `status` reports `uninitialized` when no status file exists.

## Feedback

```json
{
  "id": "fb-…",
  "category": "correctness",
  "description": "…",
  "status": "open",
  "locations": ["src/app.ts"],
  "referenceIds": [],
  "createdAt": "…",
  "updatedAt": "…",
  "verifiedAt": null,
  "verification": null,
  "fix": null
}
```

Status moves through `open`, `accepted`, `fixed`, `verified`, with `rejected` and `wontfix` as terminal opt-outs. `verification` holds `command`, `exitCode`, `output`, and `scanClean`. `fix` holds `requestedAt`, `authorized`, `scope`, `planPath`, and `appliedAt`.

## Fix Plan

```json
{
  "version": 1,
  "feedbackId": "fb-…",
  "createdAt": "…",
  "scope": ["src/app.ts"],
  "ops": [
    { "file": "src/app.ts", "startLine": 3, "endLine": 3, "expectedText": "old", "replacement": "new" }
  ]
}
```

Apply rules: every op must be inside `scope`, the line range must exist, and the current text must equal `expectedText`. Ops in one file are applied bottom-up. A record in `rejected` or `wontfix` cannot be fixed until it is reopened.

## Evidence

```json
{
  "id": "ev-…",
  "kind": "screen",
  "label": "home-page",
  "file": ".watch-references/visual/screens/home-page-…png",
  "sha256": "…",
  "bytes": 48213,
  "capturedAt": "…",
  "source": "bun run capture:screen"
}
```

The manifest is authoritative. Each entry also becomes a reference in the index so evidence is searchable next to code.

## Dev State

`pid`, `command`, `cwd`, `startedAt`, `logPath`, `exitCode`, and `restarts`. `ensure` and `start` reuse a live pid instead of spawning a second process; `status` exits non-zero when the pid is gone.

## Change Set

`{ version, at, entries }` with one entry per added, modified, or removed path. `watchref://changes` and `changes` in `scan` output describe the most recent scan only; older sets stay in `.watch-references/changelog/`.
