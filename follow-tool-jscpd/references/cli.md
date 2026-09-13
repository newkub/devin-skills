# jscpd CLI

## Install

```sh
bun add -D jscpd # or: npm i -g jscpd / cargo install jscpd / brew install jscpd / pipx install jscpd
```

## Version

- Latest: `5.2.0` (verified 2026-09-13) — Rust engine, self-contained binary (no Node.js at runtime); `cpd` = alias command
- Repository: https://github.com/kucherenko/jscpd
- Docs: https://jscpd.dev/getting-started/configuration

## Commands

| commands | description | default | options |
|---|---|---|---|
| `jscpd [paths]` | Detect copy/paste in paths | threshold `null` | see Options |
| `cpd [paths]` | Alias for `jscpd` (same binary) | — | same as `jscpd` |
| `jscpd --list` | List supported formats (224) | — | (none) |
| `jscpd --summary` | Codebase summary (top files/folders, complexity) | — | `--summary-by`, `--summary-top` |
| `jscpd --history <range>` | Duplication trend over git history | — | e.g. `v5.0.0..HEAD` |
| `jscpd --mcp` | Run MCP server over stdio | — | — |
| `jscpd --help` | Show help | — | (none) |

## Options

| Option | Description | Default |
|---|---|---|
| `--min-lines`, `-l` | Minimum duplicate lines | 5 |
| `--min-tokens`, `-k` | Minimum duplicate tokens | 50 |
| `--max-lines`, `-x` | Max source file lines | 1000 |
| `--max-size`, `-z` | Max source file size | `100kb` |
| `--threshold`, `-t` | Threshold for error exit | `null` |
| `--config`, `-c` | Path to `.jscpd.json` | `null` |
| `--ignore`, `-i` | Glob pattern of paths to ignore | `null` |
| `--ignore-pattern` | Regex over source text — exclude matched regions from detection | `null` |
| `--reporters`, `-r` | Reporters (`console`, `console-full`, `json`, `html`, `markdown`, `sarif`, `codeclimate`, `openmetrics`, `ai`, `badge`, `xml`, `csv`, `xcode`, `threshold`, `silent`) | `time,console` |
| `--output`, `-o` | Report output dir | `./report/` |
| `--mode`, `-m` | Search mode: `strict`, `mild`, `weak` | `mild` |
| `--pattern`, `-p` | Glob pattern to search | `**/*` |
| `--blame`, `-b` | Blame authors (`--reporters console-full` for side-by-side) | `false` |
| `--workers`, `-w` | Parallel workers | auto (all cores) |
| `--no-gitignore` | Ignore `.gitignore` | `false` |
| `--skip-local` | Skip clones within same directory | `false` |
| `--skip-isolated` | Skip clones between isolation groups (`a\|b` folders) | `null` |
| `--cross-formats` | Format groups sharing clone pool; preset `js-ts` | `null` |
| `--ignore-identifiers` / `--ignore-literals` / `--ignore-annotations` | Type-2 clone normalization (clone kind `renamed`) | off |
| `--max-gap-lines N` | Merge near-miss clones (kind `similar`) | 0 (off) |
| `--similarity R` | JS/TS function-level similarity `(0,1]` | 1 (off) |
| `--baseline` / `--baseline-from-ref` | Gate on new clones only | `null` |
| `--update-baseline` | Rewrite baseline file | off |
| `--fail-on-new-clones[=N]` | Exit 1 when new clones > N (needs baseline) | off |
| `--fail-on-empty` | Exit 1 when scan analyzes no files | off |
| `--exit-code N` | Exit code when clones found | 1 |
| `--no-tips` / `--silent` | Quiet CI output | `false` |

## Examples

```sh
bunx jscpd ./src
bunx jscpd ./src -r html -o ./report
bunx jscpd ./src --threshold 10 --min-tokens 30
bunx jscpd . --baseline .jscpd-baseline.json --fail-on-new-clones
bunx jscpd . --cross-formats js-ts --reporters console,json
```
