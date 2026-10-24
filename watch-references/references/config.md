# Configuration Reference

`watch-ref` reads `watch-references.json` at the project root. The file holds only values a project changes; every other default stays in code, so omit defaults instead of restating them.

## Minimal File

```json
{
  "checks": [{ "name": "test", "command": "bun test" }],
  "visual": { "capture": { "screen": "bun run capture:screen" } },
  "dev": { "command": "bun run dev" }
}
```

`watch-ref init` writes this shape without the project-specific values. `--force` overwrites an existing file.

## Keys

| Key | Default | Meaning |
| --- | --- | --- |
| `outDir` | `.watch-references` | All generated state |
| `include` | `["**/*"]` | Glob patterns to index |
| `exclude` | built-in list | Globs to skip; project entries are appended to the built-ins |
| `watch.debounceMs` | `250` | Quiet period before a watcher flush |
| `watch.pollIntervalMs` | `400` | Poll interval for file signatures |
| `watch.maxFiles` | `20000` | Upper bound on indexed files |
| `visual.screensDir` | `.watch-references/visual/screens` | Screenshot store |
| `visual.videosDir` | `.watch-references/visual/videos` | Recording store |
| `visual.runtimeDir` | `.watch-references/visual/runtime` | Runtime log store |
| `visual.retentionDays` | `0` | Prune window; `0` keeps everything |
| `visual.capture.screen` | `null` | Command used by `screen capture` |
| `visual.capture.video` | `null` | Command used by `videos capture` |
| `dev.command` | `null` | Managed dev server command |
| `dev.cwd` | `null` | Working directory for the dev server |
| `dev.autoRestart` | `false` | Reserved for restart-on-exit behavior |
| `checks` | `[]` | `{ name, command, cwd? }` entries for `watch-ref check` and verification |

Built-in excludes: `**/node_modules/**`, `**/.git/**`, `**/dist/**`, `**/build/**`, `**/coverage/**`, `**/.next/**`, `**/.cache/**`, `**/.devin/**`, `**/.watch-references/**`, `**/*.lock`, `**/*.min.js`, `**/*.map`.

`version` is accepted but normalized to `1`.

## Written Paths

| Path | Contents |
| --- | --- |
| `.watch-references/index.json` | Files and references |
| `.watch-references/status.json` | State, counts, watcher health |
| `.watch-references/changelog/` | Append-only change sets |
| `.watch-references/feedback/` | One `<id>.json` per record plus `<id>.plan.json` plans |
| `.watch-references/visual/manifest.json` | Evidence records with hashes |
| `.watch-references/visual/screens/` | Screenshots |
| `.watch-references/visual/videos/` | Recordings |
| `.watch-references/visual/runtime/` | Runtime logs |
| `.watch-references/dev/` | Dev server state and logs |
| `.watch-references/skills/` | Generated agent guides |
| `.watch-references/watch.lock` | Live watcher pid and start time |

An index write never triggers another scan because the output directory is excluded.

## Capture Environment

A capture command receives:

- `WATCH_REF_ROOT` — absolute project root.
- `WATCH_REF_EVIDENCE_PATH` — absolute file the command must write.
- `WATCH_REF_EVIDENCE_KIND` — `screen` or `video`.

Example command using Playwright:

```text
bunx playwright screenshot --viewport-size=1280,800 http://localhost:3000 "$WATCH_REF_EVIDENCE_PATH"
```

A command that exits non-zero or does not create the target path fails the capture and records nothing.

## Validation

- Every configured path resolves inside the project root; an escape fails with exit `2`.
- `include` and `exclude` are plain globs, not regular expressions.
- `checks[].name` must be unique; `watch-ref check <name>` errors on an unknown name instead of silently passing.
- Keep secrets out of the file; use a command that reads its own environment instead.
