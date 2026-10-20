---
name: follow-up-to-date
description: Keep everything current before use — detect staleness, dispatch the real updaters
argument-hint: "[scope]"
related:
  - keepup-source-code
  - update-version-to-latest
  - check-should-update
  - deep-review-codebase
  - update-devin-global-skills
  - follow-devin-global-skills
  - update-agents-md
  - update-docs
  - update-all-program-in-computer
  - update-chezmoi
  - deep-research
  - learn-from-web
  - sync-drive-d-submodules
  - report
  - suggest-next-action

---

## Goal

The repo's single convention for "up-to-date": before using any data, tool, or artifact, confirm it is still current, then dispatch the fix to the executor skill for that domain — this skill defines only the methodology, dispatch table, and verification gate; it never does the work itself

## Scope

Applies to every domain that can go stale: source code, dependencies/runtime/tools/CI, global skills, project docs, `AGENTS.md`, locally installed tools, dotfiles, submodules, and external knowledge

Not the executor of fixes — project code → `/keepup-source-code`, deps/versions → `/update-version-to-latest`; not enforced on every file touch (detect only per the triggers in `### 1`)

## Execute

### 1. Trigger When Freshness Matters

> Goal: know when an up-to-date check is required

1. Before using a fact/version/API that may be old — verify-before-use per `## Rules 1`
2. After upstream changes — dep bump, tool release, changed docs/API, a skill renamed
3. Periodic maintenance — at session start or before ship (`/ship` verify gate)
4. User signal — "outdated", "old", "stale", "doesn't work with the new version"

### 2. Detect Staleness Per Domain

> Goal: have evidence before every fix

1. Use `/check-should-update` to compare git changes and decide whether a target needs update, skip, or create
2. Use `/deep-review-codebase` to find domain signals: deprecated APIs, versions older than latest, content/links not matching reality (scopes `deprecated-apis`, `content-outdate`)
3. Compare against external latest with `/deep-research` or `/learn-from-web` — official docs/registry/release tags only, never recall values from memory
4. Consolidate into a list: `{domain, item, signal, severity}` — no signal = no change for that domain

### 3. Dispatch To The Right Updater

> Goal: every domain has exactly one clear executor

| No. | Domain | Executor |
|-----|--------|----------|
| 1 | project source code (docs/tests/config in sync with code) | `/keepup-source-code` |
| 2 | dependencies, runtime, tools, CI, lockfile | `/update-version-to-latest` |
| 3 | global skill content/repo standards | `/update-devin-global-skills` |
| 4 | project docs / `AGENTS.md` | `/update-docs`, `/update-agents-md` |
| 5 | locally installed programs | `/update-all-program-in-computer` |
| 6 | dotfiles | `/update-chezmoi` |
| 7 | git submodules (drive D) | `/sync-drive-d-submodules` |
| 8 | external knowledge (library/tool docs/API) | `/deep-research`, `/learn-from-web` |

1. Dispatch one domain at a time in order: Foundation (deps/tools) → Code → Docs/Knowledge
2. A domain without an executor → fix manually with a minimal change and record it
3. Never re-implement update logic in this skill — one executor per domain only

### 4. Verify Current

> Goal: prove things really became current

1. Run that domain's verifier — code: `/run-check`; skill: `/deep-validate`; machine: run the new command; knowledge: cite a link/registry that was live-checked
2. If it fails → `/resolve-errors` then recheck (max 3 rounds → stop and report)
3. Stamp currency on frequently changing artifacts: `> Last verified: <YYYY-MM-DD>`

### 5. Report

> Goal: summarize the staleness found and what was dispatched

1. Produce `/report` as a table: `No.`, `Domain`, `Signal`, `Executor`, `Result`
2. Run `/suggest-next-action` — periodic keepup or deferred follow-ups

## Rules

### 1. Verify Before Use

- Never use a version, API signature, command, or fact that may be old without live-checking first — always verify in step `### 2`
- Never pin versions in skill/guide docs — live-check at use time (`update-devin-global-skills` `## Conventions` standard)
- "Up-to-date" is measured by evidence (registry, release tag, official docs, git diff), not memory

### 2. Methodology Only

- This skill is the SSOT of the up-to-date principle; all execution work lives in the executors per the dispatch table — never move executor logic into this skill
- Callers hook into the method only through this table — e.g. `keepup-source-code` is the executor of the source-code domain, `follow-devin-global-skills` checks skill currency before use per `### 1`

### 3. Minimal And Deterministic

- Detect before fixing — never update without a signal; fix the age of that signal, no extra refactoring
- Every round must include a real verify result in the report — never claim a pass without running it

## Expected Outcome

- Every triggered domain has evidence, was dispatched to a single executor, and passed verify or has a clear deferral reason
- Frequently changing artifacts carry a `Last verified` stamp; no stale fact/version/API leaks into the work
- The report shows the full chain: domain → signal → executor → result
