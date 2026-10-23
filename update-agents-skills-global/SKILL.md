---
name: update-agents-skills-global
description: "Maintain global agent skills: create, update, refactor, and validate standards"
argument-hint: "[@files-or-topic... | refactor]"
related:
  - follow-default-config
  - new-skills
  - check-update
  - deep-review
  - check-reference
  - deep-research
  - follow-principles
  - deep-validate
  - learn-from-web
  - learn-from-cli
  - check-types-definition
  - report
  - ship
  - use-subagents
  - ask-me
---

## Goal

Create, update, or refactor global Devin skills in `%APPDATA%\devin\skills` so they are modern, correct, and consistent with repo standards — `SKILL.md` is the workflow entry; each `## Conventions → <section>` heading stays stable and points at its spec in `references/`

## Scope

For new or existing skills: update one skill, many skills, or the whole repo; create a new skill from an idea/topic (a single focused skill → `/new-skills`); refactor for clear SRP (`refactor` argument → `workflows/refactor/SKILL.md`); organize `workflows/` and subagent profiles (`SKILL.md ## Subagents`) per `## Conventions → Workflows And Subagents`

| Argument | Routes to |
|----------|-----------|
| none, `@files`, or a topic | this `SKILL.md` `## Execute` |
| `refactor` | `workflows/refactor/SKILL.md` — restructure skill packages (split, merge, workflows, metadata, sync refs) |
| `usage` / `skill-usage` | `references/maintenance.md` `#skill-usage-audit` — read-only dead/dying skill audit |

## Execute

### 1. Prepare Context
> Goal: know the environment, conventions, and scope before starting

1. Detect the skills dir from the path: Devin CLI → `%APPDATA%\devin\skills\` or `~/.config/devin/skills/`; Windsurf → `%APPDATA%\Codeium\Windsurf\skills\`; Codex → `~/.codex/skills/`; Claude → `~/.claude/skills/`; OpenCode → `~/.opencode/skills/` — undetectable → `/ask-me`
2. Read that repo's `global_rules.md` + `AGENTS.md`; run `/review-dot-agents-global-and-fix` + `/check-reference` on related skills, and `/use-related-skills` to consider composing/extending them
3. Skill already exists → read the original file to identify what needs changing; long-horizon/near-full context → `/follow-context-engineering`; context unavailable or a required reference missing → stop and report
4. Target family has existing skills → `/follow-principles` scope `skill` (`### 2`–`### 4` only) to collect their `Rules` + `Expected Outcome` as hard constraints; its report step is skipped

### 2. Identify Targets
> Goal: know which skill(s) to create, update, or refactor

1. `@files` → update only those (`SKILL.md` doesn't exist yet → `/new-skills`); no `@files` → pick the target set from the topic/family prefix (`follow-*`, `review-*`); no scope at all → `/ask-me` first, never sweep the whole repo
2. Keep the target list as a No./Skill/Reason/Priority table; unclear names → `/ask-me`; find related skills with `/use-related-skills` + `/search-skills`
3. Several independent skills (a whole family or >10 skills) → spawn the `skill-updater` profile (contract in `## Conventions → Workflows And Subagents`) via `/use-subagents` one skill at a time; skills sharing refs or touching `AGENTS.md`/`global_rules.md` conflict → sequential, never spawn — the parent always syncs living documents + `/git-commit` per batch + validates collectively
4. Scope includes Wrikka org packages or `use-wrikka-*` skills → run `/update-use-wrikka-project` first so every consumable package has one current use skill resolved from the registry or a sha-pinned pkg.pr.new preview, then continue the ordinary update flow

### 3. Check Duplicates And Refactor Scope
> Goal: no duplication, and know when to split into sub-files

1. `/scan-codebase` for duplicate/similar skills — heavy overlap → recommend update/extend/rename instead of creating new
2. `SKILL.md` >250 lines or multiple responsibilities → split per `## Conventions → When To Split`; restructure → `workflows/refactor/SKILL.md` (`refactor` argument)

### 4. Select Template And Structure
> Goal: the skill starts with the correct structure

1. Pick the execute pattern by prefix from `## Conventions → Templates` (longest match); matches no prefix → `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
2. Create the directory structure per `## Conventions → Directory Structure`; building an app/CLI → `/deep-review` first; user sends a URL/domain → `## Conventions → Create From URL`

### 5. Deep Research
> Goal: have the latest data before editing

1. `/deep-research` to pin down the topic/skill (skip when no research is needed); pick sources: docs/site → `/learn-from-web`, CLI → `/learn-from-cli`, library API → `/check-types-definition`, integrations/plugins/extensions → `/deep-research` (integrations domain) — official docs are the primary source
2. `/check-reference` to find stale versions/commands/links; `/check-update` to read the latest published version from GitHub releases, registry, and blog; `/deep-research` to verify latest + breaking changes; `/check-types-definition` + `/learn-from-cli` to verify `references/apis.md`/`cli.md` against the real API/commands
3. Record latest version, breaking changes, new commands, deprecations, env vars, URLs — find real examples, never guess

### 6. Prefer Existing CLI Tools Over Custom How-To
> Goal: how-tos use real installed tools; don't hand-write scripts when a CLI can do it

1. Before writing a how-to (search/replace, JSON/YAML, diff, benchmark, git, API, screenshots) → always first check `check-my-global-cli/references/global-cli-commands.md` + `check-my-global-cli/references/tool-map.md`; a tool matches the problem → reference the real command (`sd`/`sad` instead of hand-rolled replace, `yq`/`jq` instead of parsing, `hyperfine` instead of timing, `xh` instead of curl, `ast-grep` instead of regex refactor, `agent-browser`/`playwright` instead of browser automation)
2. Unsure which tool exists → `/check-my-global-cli` or `/deep-research`; write your own only when no tool exists at all; find a tool missing from the inventory/map → update both at once; install via `mise use -g <tool>` (or scoop/winget)

### 7. Write Or Update SKILL.md
> Goal: `SKILL.md` conforms to the spec

1. Update frontmatter per `## Conventions → Frontmatter Spec`; sections follow `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`; `## Execute` ≤10 steps using `### N. Step Name` + `> Goal:` + numbered list
2. Invoking other skills → `## Conventions → Invoke Skills`; update commands/options/examples/env vars/URLs and remove deprecated ones; >250 lines → move content down into `references/` per `When To Split`
3. A repo rule changes a decision (split, merge, rename, length) → cite the principle and its source at the decision point (`/follow-principles` `### 5. Apply Principles`); no source → report the gap instead of inventing one

### 8. Add References, Use Cases, Workflows, Examples, And Src
> Goal: a complete, non-redundant skill package

1. Has dependencies → write real `references/` per `## Conventions → Write References` (mandatory — except prefixes that `Directory Structure` defines as a single `SKILL.md`, e.g. `follow-create-*`/`review-*`, which merge this content into `SKILL.md` instead); `follow-lang-*` → `references/toolchain.md` (mandatory) plus any live-checked dependency knowledge; `follow-lib-*`/`follow-tool-*` → `best-practices/` + `usecases/` per `## Conventions → Write References`; separately invocable sub-workflows → `workflows/` (`follow-lang-*` always has `workflows/setup-project/`), subagent profiles → `SKILL.md ## Subagents` per `Workflows And Subagents`
2. CLI/web/MCP → `src/` per `## Conventions → Src`; templates/examples → `templates/`, `examples/`; verify all markdown links point to real files

### 9. Validate, Sync And Update References
> Goal: the skill passes every gate and living documents stay fresh

1. Gate by size: one skill → items 2–3; a family or several skills → add 4–6; repo-wide or a convention change → every item, then full `/ship` in step 10 — never run the expensive gates on a single-file edit
2. `/review-dot-agents-global-and-fix` — conventions/naming/structure; `/check-reference` — commands/APIs/claims; `/reframe` for a new skill or major rewrite
3. `/deep-validate` — frontmatter, sections, length, `related` missing/unused, TODO/MOCK/placeholder; fixing `related` → `/follow-tool-madge`; has `rules/` or `sgconfig.yml` → `/deep-review`
4. `/update-references` to sync refs across the repo + `/use-related-skills` to find integrations; rename/move → update `AGENTS.md`; involves global rules → `global_rules.md` + `/review-dot-agents-global-and-fix`
5. After any skill or tool add/remove/merge/rename → always sync living documents per `## Conventions → Living Documents` — not optional; failing → fix and recheck (max 3 → stop/report)
6. Run `bun check-skills-structure/scripts/check-skills-structure.ts --anchors --tables --findings` — every cited heading must exist in the target's `SKILL.md`, every table row must keep the header's cell count; a cross-skill citation is proven only when the citing skill is scanned
7. Cross-skill conflict — two skills state contradictory rules (content language, `related` cap, a mandatory step) → `/follow-principles` `### 3`–`### 4` ranks them, then fix at the owning skill, never keep both; unresolved authority conflict → `/ask-me`
8. Target skill prefix is `review-` → show the review findings, then `/ask-me` whether to fix; no → deliver the review only; yes → fix every confirmed finding and re-run the review until clean (max 3 rounds → stop and report)

### 10. Ship
> Goal: deliver the work

1. Run `/ship` — fails → report the status and stop
2. Run `/report` summarizing topic, old/new info, files changed, next actions

## Conventions

> The repo standard. Every `###` heading below is a stable anchor cited by other skills; the full spec lives in `references/`.

### Frontmatter Spec

See [references/frontmatter.md](references/frontmatter.md) — required/recommended/optional fields, body shape, and the `check-*` allowed-tools rule.

### Skill Prefixes

See [references/prefixes.md](references/prefixes.md) — the follow/check/review/deep family taxonomy and the review preset + subagent requirement.

### Templates

See [references/templates.md](references/templates.md) — the execute-pattern core for every prefix (longest match first).

### Directory Structure

See [references/structure.md](references/structure.md#directory-structure) — package shapes for `review-*`, `follow-create-*`, `follow-lib-*`, `follow-lang-*`, `deep-review`, `design-*`, `refactor`, and `implement-to-production`.

### When To Split

See [references/structure.md](references/structure.md#when-to-split) — violation → fix and the split procedure.

### Workflows And Subagents

See [references/workflows.md](references/workflows.md) — content decision matrix, lifecycle prefixes, consolidation, subagent rules, and the `skill-updater` profile.

### Invoke Skills

See [references/invoke-skills.md](references/invoke-skills.md) — invocation syntax, ordering, `related` contract, and limits.

### Write References

See [references/write-references.md](references/write-references.md) — mandatory `references/`, `best-practices/`, and `usecases/` specs per prefix; single-source rules per `/follow-single-of-source`.

### Src

See [references/structure.md](references/structure.md#src) — when to create `src/` and which create skill owns it.

### Create From URL

See [references/create-from-url.md](references/create-from-url.md) — URL → parent + workflows flow.

### Skill Usage Audit

See [references/maintenance.md](references/maintenance.md#skill-usage-audit) — read-only dead/dying skill audit (`usage`/`skill-usage` argument).

### Living Documents

See [references/maintenance.md](references/maintenance.md#living-documents) — documents to sync when skills, tools, or dependencies change.

## Rules

1. Single Responsibility And Refactor — every file in a skill package ≤250 lines; `SKILL.md` = entry point holding the high-level workflow + pointers; split sub-files per `## Conventions → When To Split`/`Directory Structure`; content duplicating another skill → merge into the existing one
2. Official Sources And Evidence — official docs, changelog, repository are the primary sources (never third-party when an official one exists), state source URLs; every change carries evidence + the researched version — never guess APIs, commands, or versions
3. Safety — dry run before destructive/high-risk actions; overwriting an existing file → user confirmation; never break references or existing skills; `permissions` must list `deny` for risky system paths; no secrets/credentials in prompts
4. Content Standard — how-tos reference actually installed CLI tools (inventory `check-my-global-cli/references/global-cli-commands.md`, map `check-my-global-cli/references/tool-map.md`), never hand-write scripts when a CLI can do it (none exists → `/deep-research` or `mise use -g`); `name` matches directory name, `description` ≤100 characters; no TODO/MOCK/placeholder — flag uncertainty explicitly; global skills written in English; no `**` bold; config guidance follows `/follow-default-config` (only overrides of tool defaults, verified via `/check-types-definition`/official docs); install per ecosystem `bun add`/`cargo add`/`go get`/`pip install`/`mise use -g npm:<package>` — avoid floating ranges
5. Precedence — `global_rules.md` + root `AGENTS.md` set the authority order; within a skill, `## Rules` beats `## Execute`; this skill's `## Conventions` beats a one-skill local convention; two skills contradicting → `/follow-principles` `### 3`–`### 4` ranks them, then fix at the owning skill — never keep both; an unresolved authority conflict (e.g. content language) → `/ask-me`, never pick silently
6. Review Targets Need Consent — a skill whose prefix is `review-` is never fixed without approval: present the findings, `/ask-me`, then fix only on a yes and re-review until clean (max 3 rounds, then stop and report)

## Expected Outcome

- New/updated skills reflect the latest versions, APIs, commands, and best practices; deprecated items removed; `SKILL.md` passes `/deep-validate`, ≤250 lines, no TODO/MOCK/placeholder; `related` complete with no missing/unused entries; every `follow-lib-*`/`follow-tool-*` has `best-practices/` + `usecases/` wired from `SKILL.md`; references fully updated across `AGENTS.md`, `global_rules.md`, and related skills; `/report` summarizes findings and changes
