# Engines

The CLI is a set of adapters behind one rule catalog. Each engine runs only when at least one of its rules is selected and the engine is enabled, so `--rules struct` never starts Biome, shellcheck, gitleaks, or lychee.

## Engine Summary

| Engine | Rules | Default | Implementation |
|--------|-------|---------|----------------|
| `own` | 42 | on | Bun parser and rule modules inside `scripts/lib/` |
| `biome` | 2 | on | `biome check --reporter=json` over package files |
| `ast-grep` | 1 | on | `sg scan --config scripts/ast-grep/sgconfig.yml --json` |
| `shellcheck` | 2 | on | `shellcheck --format=json1 --severity=style --shell=sh` |
| `gitleaks` | 1 | opt-in | `gitleaks detect --no-git` with a generated config |
| `lychee` | 1 | opt-in | `lychee --format json` over links collected from skill markdown |

The execution order is fixed: `own`, `biome`, `ast-grep`, `shellcheck`, `gitleaks`, `lychee`. Findings keep that order, then file, line, and rule order.

## Own Engine

Markdown and frontmatter are parsed in-process, so it has no external dependency and runs on every platform. It reads every skill directory, every `workflows/<name>/SKILL.md`, and the text files under each skill package. It reports elapsed milliseconds in the engine note.

The own engine covers the `struct`, `meta`, `graph`, `content`, and `sec` namespaces except `sec/no-secret`, plus no code rules. It is the only engine that can run with `--engine own` and the only one guaranteed to work on a bare machine.

## Biome

Runs `biome check` with the JSON reporter, `--no-errors-on-unmatched`, and at most 200 diagnostics, 150 files per invocation. File set: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.json`, `.jsonc`, `.css` under skill packages. The working directory is the scan root, so an existing `biome.json` is honored.

- Diagnostics whose category starts with `format` become `code/biome-format`
- Diagnostics whose category starts with `lint` or `parse` become `code/biome-lint`
- Biome severity `error` or `fatal` maps to `critical`; `warning` stays `warning`; `info`, `hint`, and `style` map to `info`
- The engine reports `ok` with its file count; a failed chunk is noted, and the run errors only when every chunk fails

## Ast-Grep

Runs `sg scan` with the package config at `scripts/ast-grep/sgconfig.yml`, which points `ruleDirs` at `scripts/ast-grep/rules`, 80 skill directories per invocation. Only rule IDs containing `no-eval` map to `sec/dynamic-exec`; other matches are ignored and listed in the status note so a stale shared config cannot invent findings.

Line numbers from ast-grep are zero-based and are shifted by one. A missing `sg` binary or a missing config file marks the engine `missing` rather than failing the scan.

## Shellcheck

Runs `shellcheck --format=json1 --severity=style --shell=sh` on every `.sh` file under skill packages, 100 files per invocation, with the scan root as the working directory.

- Level `error` becomes `code/sh-syntax` with `critical` severity
- Every other level becomes `code/sh-lint`, `warning` for `warning` and `info` for the rest
- Messages keep the shellcheck code, for example `SC2086: Double quote to prevent globbing`
- A chunk whose JSON cannot be parsed is noted; the engine errors only when every chunk fails

## Gitleaks

Opt-in because it scans file contents for credentials and is slower than the own rules. The adapter writes a temporary config, then runs `gitleaks detect --no-git --source <root> --report-format json --redact --exit-code 0`.

- The config extends the gitleaks default ruleset and allowlists `node_modules`, `.git`, and common lockfiles
- Findings are limited to files inside the selected skill directories
- Messages are `rule-id: description`; the matched secret is never included, and `--redact` is always on
- `--exit-code 0` keeps a finding from being mistaken for an engine crash
- The temporary directory is removed in a `finally` block even when the engine fails

## Lychee

Opt-in because it makes network requests. The adapter collects `http` and `https` URLs from skill markdown outside fenced code blocks, keeps the first file and line for each URL, caps the set at 500 URLs, and runs lychee 100 URLs at a time with a 20 second timeout and concurrency 8.

A URL that fails at the network layer can make lychee exit without writing a report. The adapter handles this in three steps:

1. Parse `error sending request for url (...)` entries from stderr
2. Emit `graph/external-link-dead` for each known URL, then remove those URLs from the pending list
3. Retry the remainder, up to 20 attempts per chunk

If a chunk still fails and no URL could be salvaged, the failure is recorded; the engine errors only when it produced no findings at all. Findings are deduplicated by URL and anchored at the first referencing file and line.

## Missing And Failed Engines

| Situation | Status | Exit code impact |
|-----------|--------|------------------|
| engine not enabled by default and not requested | not listed | none |
| no selected rule belongs to the engine | `skipped` | none |
| default engine binary absent | `missing` | none; the run continues |
| explicitly requested engine binary absent | `missing` | 2, after the report is printed |
| engine crashes on every chunk | engine `error` | 2 |

`--engine none` disables every engine, which is useful to validate arguments or produce an empty report. `--engine` accepts a comma list and rejects unknown names and `none` combined with other engines.

## Temp Files

Only gitleaks needs temp files: a config and a report. `makeTempDir` prefers `AGENTS_LINT_TMP`, then `D:\tmp`, then the OS temp directory, and creates the directory when missing. Files are removed after each run.

## Read-Only Guarantees

- `biome check` is used, never `biome check --write` or `biome format --write`
- gitleaks runs in `detect` mode without git history and writes only inside its temp directory
- shellcheck, ast-grep, and lychee only read the scanned tree
- the own engine opens files for reading only
- `--baseline` reads a report; it never writes or updates one

## Output Contract

| Format | Flag | Use |
|--------|------|-----|
| text | default | human triage with fix owners |
| finding lines | `--findings` | piping into another tool |
| JSON | `--json` | baselines, dashboards, custom reporting |
| SARIF | `--sarif` | GitHub code scanning and other SARIF consumers |

`--json` and `--sarif` are mutually exclusive. Exit code 0 means no finding at or above `--fail-on`, 1 means at least one, and 2 means invalid usage, unreadable input, or a missing explicitly requested engine.
