---
name: review-update
description: Review docs, config, rules and references for drift, then sync them to the code
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - update-project
  - update-docs
  - update-agents-md
  - update-references
  - update-config
  - update-dot-agents-project
  - update-astgrep-rules
  - check-reference
  - deep-validate
  - use-subagents
  - suggest-next-action
  - ask-me
---

## Goal

Find where documentation, config, rules, and references no longer match the code, then drive the owning update skills until the declared surface and the real surface agree

## Scope

Use after a change shipped, before a release, or whenever the question is "is the project still describing itself correctly" — a path, workspace, whole repository, or diff

- Entered through `/deep-review` with the `update` or `docs` signal, or called by name; scope and flags are passed through as given
- Drift means declared ≠ real: a doc naming a removed command, an `AGENTS.md` step that no longer runs, a config key nothing reads, a link to a moved file, a rule that fires on an abandoned pattern, a manifest script that is gone
- Fixing belongs to the update owners: `/update-project` (root sync), `/update-docs`, `/update-agents-md`, `/update-references`, `/update-config`, `/update-dot-agents-project`, `/update-astgrep-rules`. This preset confirms drift, orders it, and verifies the result — it never rewrites those files itself
- New docs with no prior version → not drift; that is `/update-docs` directly. Code that contradicts a doc without the code being wrong → the doc is updated only after the user confirms which side is the source of truth
- Without `then-fix` the run is report-only: a drift table with both sides cited, plus the suggested update order

## Execute

### 1. Think

> Goal: know which declared surfaces exist and which bind the code

1. Run `/deep-thinking` on the scope — which surfaces exist (docs, `AGENTS.md`, `README.md`, config, manifests, rules, skills) and which of them make claims about the code
2. Read the project `AGENTS.md` conventions — it is both a review target and the rules that decide what "current" means
3. Identify the authoritative side per artifact: code wins for behavior, schema wins for data, the manifest wins for scripts and deps, and a doc wins only when the user says so
4. Pick the mode: `[scope]` limits the review; `--diff` reviews only files changed plus the declarations they touch

### 2. Inventory The Declared Surface

> Goal: one list of everything that makes a claim

1. Enumerate docs: `README.md`, `AGENTS.md` in every workspace, `docs/`, `USAGE.md`, `FEATURES.md`, `TODO.md`, `.devin/plan`/`.agents/rules`
2. Enumerate config: manifests (`package.json`/`Cargo.toml`), lockfiles, CI workflows, environment examples, tool configs, and workspace manifests
3. Enumerate references: markdown links, import paths, alias configs, and skill/workflow names mentioned in docs
4. Enumerate rules: ast-grep `rules/` + `sgconfig.yml`, `.agents/rules/*.md`, and project skills that encode conventions
5. Record each surface with its path and the kind of claim it makes — this list bounds the run

### 3. Scan For Drift

> Goal: one evidence pass, not one pass per surface

1. Run `/deep-review-codebase-everything` on the scope with the `docs`, `config`, and `dependencies` labels, passing `--diff` when diff-scoped — read its report, do not rerun the analyzer
2. Run `/check-reference` for links and referenced paths — a target that no longer exists is drift with a one-line proof
3. For each doc claim about behavior, check the code it names: route, command, script, env var, flag, file. Missing on the code side → drift; present but different → drift with both sides
4. For each config key, check the code that reads it — nothing reads it → dead config; code reads a key absent from `.env.example` → missing declaration (that item belongs to `/review-implement-to-production`)
5. For each rule, check it still matches the current code — a rule that fires on an abandoned pattern or no longer fires on the pattern it was written for is stale
6. Cross-reference: one renamed command explains a README line, an `AGENTS.md` step, a link, and a completions list → one item with four sites

### 4. Confirm Each Drift Item

> Goal: no false positives and no doc rewrite that contradicts working code

1. Every item states both sides: declared (`file:line` + quote) and real (`file:line` or command output)
2. Assign one status: `stale` (doc/config describes an older reality), `missing` (code exists, declaration absent), `orphan` (declaration exists, code absent), `broken` (link/path/name no longer resolves), `ambiguous` (both sides defensible, needs the user's call)
3. A code bug found while checking → route it to `/deep-review-codebase-everything`; it is not fixed by editing the doc
4. `ambiguous` items are grouped for one `/ask-me` in the fix step; they are never resolved by silently trusting one side
5. Drop formatting-only and wording-only diffs unless the project has a doc convention that makes them violations

### 5. Order The Update

> Goal: fix in dependency order so a later update does not reintroduce drift

1. Order: manifest/config → `AGENTS.md` → `README.md`/`docs` → references/links → rules. A new script or path lands in config first, then the docs that cite it
2. Cross-reference items with one root cause: a rename closes its docs, links, and rules together
3. Large or cross-workspace set → `/create-plan-in-dot-agents`; a version/dependency jump → `/update-version-to-latest` before the config and docs that describe it
4. Without `then-fix` → stop here, report the ordered table, and close with `/suggest-next-action`

### 6. Fix Through The Owners

> Goal: each surface is updated by the skill that owns it, within the confirmed set

1. Confirm the fix list with `/ask-me` — per item, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follow the report as-is
2. Run `/update-project` for the root/workspace sync; `/update-docs` for `docs/` content; `/update-agents-md` when `AGENTS.md` steps, paths, commands, or skills changed; `/update-config` for config drift; `/update-references` after any move/rename/delete
3. Persist conventions and patterns so the drift cannot recur: `/update-dot-agents-project` for natural-language rules, `/update-astgrep-rules` for mechanical patterns
4. A rule change that makes existing code fail → report it as a code finding for the owner skill, not as a reason to weaken the rule
5. In the skills repository, global convention changes go through `/update-agents-skills-global`; never hand-edit the canonical convention section

### 7. Verify

> Goal: declared and real agree, proven by re-checking the same instruments

1. Re-run `/check-reference` — zero broken links in the touched surface
2. Re-read each updated claim against the code it names; a claim you cannot verify is removed or marked pending, never left as if verified
3. Run `/deep-validate` on the updated files and the project's `/run-check` — green before reporting done
4. Run the project's docs/config gate if one exists (link check in CI, schema validation, lint for JSON/YAML/TOML)
5. Re-scan the touched scope only (`--diff`) — the drift items must be gone; anything still open is reported with the reason

### 8. Report

> Goal: the before → after state is visible and the next action is clear

1. Run `/report-review`: counts per status and per surface, the order that was applied, and the verification result
2. Report each closed item as declared → real now, with the file that changed
3. List the items deliberately not changed (ambiguous, out of scope, blocked) with the reason
4. Close with `/suggest-next-action`

## Rules

- Docs follow code; a doc is never made "right" by editing code from this skill — a code contradiction is routed, not patched
- Both sides cited — every drift item quotes the declaration and points to the reality; no item from intuition
- One owner per surface — this skill confirms and orders, the `update-*` skills write
- No cosmetic churn — wording and format changes only when a stated convention makes them violations
- Ambiguity is one `/ask-me`, never a silent pick; `dont-ask-me` reports the ambiguous set instead of guessing
- The same instruments verify the fix that found the drift (`/check-reference`, the doc gate, a `--diff` re-scan)
- Report-only unless `then-fix`; with `then-fix`, only the confirmed set is updated
- Never touch files outside the confirmed set; never commit or push unless asked
- Use `/use-subagents` if needed — independent surfaces or workspaces updated in parallel with disjoint file sets

## Expected Outcome

- A drift table where every item has both sides, a status, and the update owner that closed it
- The declared surface matches the code: links resolve, config keys are read, `AGENTS.md` steps run, rules match the current patterns
- Verification re-run with the same instruments, and any remaining ambiguity or blocked item named explicitly
- Without `then-fix`: a prioritized update order and no edits
