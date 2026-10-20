---
name: run-bench-deps
description: Benchmark deps — CLI table (installed vs latest, bundle, status, health) to decide upgrade/swap
argument-hint: "[scope] [--json] [--top N]"
related:
  - update-version-to-latest
  - improve
  - optimize
  - report
---

## Goal

Report all of the project's dependencies as a comparison table — see installed vs latest, bundle cost, health/status, and alternatives at a glance in one command, to decide whether to upgrade or swap deps

## Scope

Use when benching/auditing a project's dependencies — report-only, never edits `package.json`; real upgrades go through `/update-version-to-latest`, swaps through `/improve deps`/`/optimize`

## Execute

> Pre-Run: always run `/deep-review` first — `run-*` skills must be reviewed/assessed before the main action, never skip; if findings are blockers, fix or report them before running (bench-deps)

### 1. Collect Dependencies

> Goal: gather unique deps across the whole monorepo

1. Read the root `package.json` + workspace manifests (`workspaces` globs) — include `dependencies`, `devDependencies`, `peerDependencies`
2. dedupe into `name → { installed: version-spec, usedIn: [workspaces] }`
3. If `bun.lock`/`pnpm-lock.yaml` exists → resolve the actual installed version from the lockfile instead of the spec range

### 2. Gather Metrics Per Dep

> Goal: complete metadata per dep

1. npm registry abbreviated packument (`Accept: application/vnd.npm.install-v1+json`) → `dist-tags.latest`, `time` (release dates), `deprecated`
2. downloads/week → `https://api.npmjs.org/downloads/point/last-week/{name}` (encode scoped names)
3. bundle size → `https://bundlephobia.com/api/size?package={name}@{version}` — best-effort, timeout or error → `-`
4. derivations: `status` = `deprecated` > `unmaintained` (>2y since latest publish) > `prerelease` (latest is a pre-release tag) > `stable`; `outdated` = installed major < latest major; `minor/patch behind` when the major matches but it is below latest

### 3. Render Table

> Goal: one table that tells the whole story

| Column | Source | Note |
|---|---|---|
| `Package` | name | show scoped names in full |
| `Installed` | lockfile/spec | e.g. `^4.17.21` |
| `Latest` | dist-tags | e.g. `4.21.0` |
| `Released` | time[latest] | relative (`3mo ago`) |
| `Status` | derived | `stable`/`beta`/`deprecated`/`unmaintained`/`outdated` |
| `Bundle` | bundlephobia | min+gzip KB; `-` if unavailable |
| `DL/wk` | npm downloads | humanized (`1.2M`) |
| `License` | registry | `MIT`/`Apache-2.0` |
| `Used in` | workspaces | count, or `*` = root |

1. sort: `deprecated`/`unmaintained`/`outdated` first, then by bundle size largest→smallest
2. `--json` → emit a machine-readable array instead of the table; `--top N` → only the first N rows
3. summary line at the end of the table: total deps, outdated count, deprecated count, bundle total

### 4. Report

> Goal: findings lead to action

1. Run `/report` — table + highlights: deprecated/unmaintained deps, outdated majors, bundle hogs (top 5 largest)
2. Suggest the next action: `/update-version-to-latest` for outdated, `/improve deps` for swap alternatives

## Rules

- Report-only — this skill must never edit `package.json`/lockfile
- Network calls must be best-effort — registry/bundlephobia down → show `-` and continue, never fail the whole report
- Limit concurrency to ≤10 per external API — never spam the registry
- Use `/update-version-to-latest` for real upgrades — this skill only reports
- Use `scripts/bench-deps.ts` (bun) if present in the project or this skill — `bun run scripts/bench-deps.ts`

## Expected Outcome

- Comparison table covering every dep with installed/latest/status/bundle/downloads
- Clear highlights: deprecated, unmaintained, outdated majors, bundle hogs
- Ready to decide upgrade/swap via `/update-version-to-latest` or `/improve deps`
