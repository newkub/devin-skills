---
name: update-devin-global-skills
description: "Maintain global Devin skills: create, update, refactor, and validate against repo standards"
argument-hint: "[@files-or-topic...]"
related:
  - idea-use-skills-relations
  - new-skills
  - refactor-skills
  - follow-single-of-source
  - deep-review
  - check-reference
  - deep-research
  - research-setup-integrations
  - deep-validate
  - learn-from-web
  - learn-from-cli
  - check-types-definition
  - report
  - ship
  - use-subagents
---

## Goal

Create, update, or refactor global Devin skills in `%APPDATA%\devin\skills` so they are modern, correct, and consistent with repo standards — this skill is a single-file package keeping all conventions in `## Conventions`

## Scope

For new or existing skills: update one skill, many skills, or the whole repo; create a new skill from an idea/topic (a single focused skill → `/new-skills`); refactor for clear SRP (restructure → `/refactor-skills`); organize `workflows/` and subagent profiles (`SKILL.md ## Subagents`) per `## Conventions → Workflows And Subagents`

## Execute

### 1. Prepare Context
> Goal: know the environment, conventions, and scope before starting

1. Detect the skills dir from the path: Devin CLI → `%APPDATA%\devin\skills\` or `~/.config/devin/skills/`; Windsurf → `%APPDATA%\Codeium\Windsurf\skills\`; Codex → `~/.codex/skills/`; Claude → `~/.claude/skills/`; OpenCode → `~/.opencode/skills/` — undetectable → `/ask-me`
2. Read that repo's `global_rules.md` + `AGENTS.md`; run `/review-devin-global-harness` + `/check-reference` on related skills, and `/use-related-skills` to consider composing/extending them
3. Skill already exists → read the original file to identify what needs changing; long-horizon/near-full context → `/follow-context-engineering`; context unavailable or a required reference missing → stop and report

### 2. Identify Targets
> Goal: know which skill(s) to create, update, or refactor

1. `@files` → update only those (`SKILL.md` doesn't exist yet → `/new-skills`); no `@files` → pick the target set from the topic/family prefix (`follow-*`, `review-*`); no scope at all → `/ask-me` first, never sweep the whole repo
2. Keep the target list as a No./Skill/Reason/Priority table; unclear names → `/ask-me`; find related skills with `/use-related-skills` + `/search-skills`
3. Several independent skills (a whole family or >10 skills) → spawn the `skill-updater` profile (contract in `## Conventions → Workflows And Subagents`) via `/use-subagents` one skill at a time; skills sharing refs or touching `AGENTS.md`/`global_rules.md` conflict → sequential, never spawn — the parent always syncs living documents + `/git-commit` per batch + validates collectively

### 3. Check Duplicates And Refactor Scope
> Goal: no duplication, and know when to split into sub-files

1. `/scan-codebase` for duplicate/similar skills — heavy overlap → recommend update/extend/rename instead of creating new
2. `SKILL.md` >250 lines or multiple responsibilities → split per `## Conventions → When To Split`; restructure → `/refactor-skills`

### 4. Select Template And Structure
> Goal: the skill starts with the correct structure

1. Pick the execute pattern by prefix from `## Conventions → Templates` (longest match); matches no prefix → `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
2. Create the directory structure per `## Conventions → Directory Structure`; building an app/CLI → `/deep-review` first; user sends a URL/domain → `## Conventions → Create From URL`

### 5. Deep Research
> Goal: have the latest data before editing

1. `/deep-research` to pin down the topic/skill (skip when no research is needed); pick sources: docs/site → `/learn-from-web`, CLI → `/learn-from-cli`, library API → `/check-types-definition`, integrations/plugins/extensions → `/research-setup-integrations` — official docs are the primary source
2. `/deep-review` to find stale versions/commands/links; `/deep-review` to verify latest + breaking changes; `/deep-review` to verify `references/apis.md`/`cli.md` against the real API/commands
3. Record latest version, breaking changes, new commands, deprecations, env vars, URLs — find real examples, never guess

### 5b. Prefer Existing CLI Tools Over Custom How-To
> Goal: how-tos use real installed tools; don't hand-write scripts when a CLI can do it

1. Before writing a how-to (search/replace, JSON/YAML, diff, benchmark, git, API, screenshots) → always first check `check-my-global-cli/references/global-cli-commands.md` + `follow-skills-map/references/tool-map.md`; a tool matches the problem → reference the real command (`sd`/`sad` instead of hand-rolled replace, `yq`/`jq` instead of parsing, `hyperfine` instead of timing, `xh` instead of curl, `ast-grep` instead of regex refactor, `agent-browser`/`playwright` instead of browser automation)
2. Unsure which tool exists → `/check-my-global-cli` or `/deep-research`; write your own only when no tool exists at all; find a tool missing from the inventory/map → update both at once; install via `mise use -g <tool>` (or scoop/winget)

### 6. Write Or Update SKILL.md
> Goal: `SKILL.md` conforms to the spec

1. Update frontmatter per `## Conventions → Frontmatter Spec`; sections follow `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`; `## Execute` ≤10 steps using `### N. Step Name` + `> Goal:` + numbered list
2. Invoking other skills → `## Conventions → Invoke Skills`; update commands/options/examples/env vars/URLs and remove deprecated ones; >250 lines → move content down into `references/` per `When To Split`

### 7. Add References, Workflows, Examples, And Src
> Goal: a complete, non-redundant skill package

1. Has dependencies → write real `references/` per `## Conventions → Write References` (mandatory — except prefixes that `Directory Structure` defines as a single `SKILL.md`, e.g. `follow-create-*`/`review-*`, which merge this content into `SKILL.md` instead); separately invocable sub-workflows → `workflows/`, subagent profiles → `SKILL.md ## Subagents` per `Workflows And Subagents`
2. CLI/web/MCP → `src/` per `## Conventions → Src`; templates/examples → `templates/`, `examples/`; verify all markdown links point to real files

### 8. Validate, Sync And Update References
> Goal: the skill passes every gate and living documents stay fresh

1. `/review-devin-global-harness` — conventions/naming/structure; `/check-reference` — commands/APIs/claims; `/reframe` for a new skill or major rewrite
2. `/deep-validate` — frontmatter, sections, length, `related` missing/unused, TODO/MOCK/placeholder; fixing `related` → `/follow-tool-madge`; has `rules/` or `sgconfig.yml` → `/deep-review`
3. `/update-references` to sync refs across the repo + `/use-related-skills` to find integrations; rename/move → update `AGENTS.md`; involves global rules → `global_rules.md` + `/update-devin-harness`
4. After any skill or tool add/remove/merge/rename → always sync living documents per `## Conventions → Living Documents` — not optional; failing → fix and recheck (max 3 → stop/report)

### 9. Ship
> Goal: deliver the work

Run `/ship` — fails → report the status and stop — then `/report` summarizing topic, old/new info, files changed, next actions

## Conventions

### Frontmatter Spec

- Required: `name` (matches the dir, lowercase separated by `-`), `description` ≤100 characters; recommended: `argument-hint`, `allowed-tools` (only what's needed), `related` ≤15 (real dirs + actually mentioned in the body)
- Optional: `model` (`sonnet`/`swe`/`opus`/`codex`), `subagent: true`, `agent: <profile>` (takes precedence over subagent), `permissions` (`allow`/`deny`/`ask`), `triggers` (default `['user','model']`)
- Body: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome` (plus `## Key Concepts`/`## Principles`/`## Guide`/`## Examples` when needed); backticks for tools/commands/paths/skills; no `**` bold
- `check-*` skills → `allowed-tools` must include `exec`, `grep`, `glob`, `find_file_by_name` and use commands/scripts/linters instead of eyeballing — reproducible results citable by file/line

### Skill Prefixes

`follow-lang-*` runtime · `follow-framework-*` meta/app framework · `follow-service-*` external service/cloud · `follow-lib-*` importable lib · `follow-tool-*` CLI/build tool · `follow-create-*` create plugins/extensions/CLI/lib · `follow-*` concept/practice (`follow-tdd`, `follow-deploy`) — matches no prefix → keep `follow-`; spans several categories → choose by primary responsibility

`check-*` detector pass/fail + locations (read-only) · `review-*` single-dimension assessor (findings + severity + evidence — all domain reviews merged inline into `deep-review/SKILL.md` (`## Review Domains` table + `## Domain Pipeline`/`## Domain Guides`/`## Pattern Guides`) dispatched via `/deep-review`; only these stay top-level: `review-devin-global-harness`, `review-github-pr`, `review-github-issue`, `review-test` — a thin entry pointing at a single domain) · `deep-*` multi-step/multi-dimension orchestrator — one direction `check` → `review` → `## Fix`; `improve-*`/`optimize-*` top-level = thin entry — find findings via `/deep-review` domains then fix after user confirm + must have `### Tools And Libraries` at the end of `## Scope` (before `## Execute`) — a `| Skill | When To Use |` table mapping `follow-tool-*`/`follow-lib-*`/`follow-service-*` by domain (seo → unlighthouse+takumi; uxui → unlighthouse+unocss/shiki/comark; perf → unlighthouse; bundle → sonda+node-modules-inspector), every entry in `related` + with a real dir (missing → create first via `/new-skills`), as a hint during review/fix, not all mandatory; creating a new `follow-*` → reverse-wire it into the related-domain `improve-*`/`optimize-*`; a new top-level `review-*` must delegate → `/deep-review` domain, never duplicate content; the fixer lives in `## Fix` of `deep-review/SKILL.md`; deviating from the template → state the reason in `## Scope`

`deep-review` and the remaining `review-*` (`review-devin-global-harness`, `review-github-pr`, `review-github-issue`, `review-test`) must have `/use-subagents` in `related` + a "use /use-subagents if needed" rule in the body (before `## Expected Outcome`) — spawn subagents when review items/areas are independent of each other

### Templates

Execute pattern core per prefix (choose longest match first, e.g. `follow-lib-*` over `follow-*`):

| Prefix | Execute Pattern Core |
|--------|----------------------|
| `run-*` | prereq check (missing → stop) → run with timeout (non-block long-running, block short tasks) → fail: `/resolve-errors`, dep → `/run-install` retry×1, config → `/deep-review`; repeats ×3 → stop; report success/duration/metrics; never destructive without confirm |
| `follow-lib-*` | check manifest+registry+ecosystem → `/learn` official to confirm install cmd/version/peer deps → config+entry point → `/deep-validate`; `references/` has only `apis.md`+`cli.md` (tables only — per `## Conventions → Write References`; no CLI → no `cli.md`); must have `best-practices/` (flat `.md` — patterns/pitfalls/do-don't written from actual research); many use cases → `workflows/<lib>/` |
| `follow-create-*` | identify target → `../follow-my-techstack/references/techstack-catalog.md` + `/deep-review` → dispatch `follow-create-cli`/`-web`/`-mcp` → scaffold `src/` → dev/build/test pass → MCP → `mcp_config.json` → `/deep-validate` + `/ship` |
| `follow-*` | check version in manifest (tool not found → stop) → `/learn` official + version compat → config with minimal diff → typecheck/lint/tests → `/ship`; never rewrite the whole file, don't force upgrades |
| `setup-*` | prereq + idempotent check (already set up → verify only) → official docs, secrets → `/follow-secret-manager`, never commit → smoke check (`--version`/`doctor`/`status`); fail → `/resolve-errors`×3 |
| `config-*` | read current config first (`/deep-review` domain `review-config`) → merge only necessary keys, never clobber, no secrets in config → verify with the tool's validate command → `/report-before-after` |
| `deploy-*` | readiness (build/tests/secrets; a `deploy-to-<platform>` exists → use it) → official CLI staging→prod recording URL+revision, destructive → confirm → smoke test+logs, fail → rollback/`/resolve-errors`×3 |
| `migrate-*` | `/plan` from→to + official migration guide + rollback path + data backup → incremental config→deps→code→data use `/use-astgrep` instead of manual, separate commits → lint/test/smoke + check leftover deprecated → `/report-before-after`+`/ship` |
| `optimize-*` | always baseline first (`/run-bench`, `/deep-optimize`) → fix one point at a time high impact→low, preserve behavior (optimize ≠ change output) → re-measure `/report-before-after`; no improvement → revert; + `### Tools And Libraries` per `Skill Prefixes` |
| `improve-*` | run `/review-*`/`/check-*` to find real targets first, never guess → apply one at a time, preserve behavior, never mix refactor+behavior in one commit → verify lint/tests → `/report` what improved; + `### Tools And Libraries` per `Skill Prefixes` |
| `fix-*` | confirm root cause first, never fix by symptom (unclear → `/analyze-root-cause-analysis`/`/deep-debug`) → minimal fix → verify `/run-check` no regression; fail → `/resolve-errors`×3 |
| `update-*` | read the original and understand intent first → minimal + idempotent + `/update-references` if move/rename → diff before/after verify refs aren't stale → `/report-before-after` |
| `check-*` | target+criteria → `/scan-codebase` + grep/ast-grep/jscpd/knip → `scripts/<name>.ts` runnable repeatedly → Critical/Warning/Info + file:line + recommendation for every finding; cover all workspaces incl. gitignored; `allowed-tools` include `exec`/`grep`/`find_file_by_name` |
| `analyze-*` | the agent analyzes first → insufficient data → `/deep-analyze`; repeatable → `/use-scripts` helper, not an agent replacement → `/report table` ordered by impact, every finding has evidence (assumption → state it) |
| `deep-*` | must have `/deep-thinking` as the first step always → identify dimensions → `/deep-research`+`/deep-analyze` per dimension, stepwise, gathering evidence before acting (every non-alias; alias stubs that forward → canonical are exempt — the canonical holds these two steps) → cross-reference for shared root causes → `/report table` ordered by impact/effort + immediate/long-term; cover all dimensions or report "no issues" |
| `review-*` | deep pre-pass always first: `/deep-thinking` → `/deep-analyze` → `/deep-validate` (mandatory for every `review-*`; thin entries forwarding to a canonical inherit it there) → `/scan-codebase`+`/deep-review`+ast-grep → cross-check evidence, filter false positives → severity Critical/High/Medium/Low/Info + score (weighted 0/25/50/75/100) → fixes grouped immediate/short/long-term `/report-review` |
| `report-*` | `/scan-codebase` to group+metrics+patterns → `/report table` headings/lists with the summary on top → next actions + `/suggest-next-action`; state source+date, don't dump everything |
| `idea-*` | `/deep-analyze`+`/bench-competitors` to find gaps/opportunities → ideas + continuous numbering + scope/impact/effort `/report table` ordered by impact/effort; actionable only, never reset numbering |

### Directory Structure

```text
<skill>/ SKILL.md (entry — workflow + dispatch) · references/ (passive knowledge, flat) ·
best-practices/ (recommended patterns + pitfalls — required for follow-lib-*/follow-tool-*) ·
workflows/<name>/SKILL.md (invocable child) ·
templates/ examples/ scripts/ src/ guide/
```

Start with a single `SKILL.md` — add subdirs only when truly needed; every file ≤250 lines with clear SRP; `references/` flat — nested → `/flatten-directory --mode refs`; `## Execute` mentioning CLI/web/MCP → `src/` (`### Src` below)

`review-*` package = a single `SKILL.md` (`review-github-pr`, `review-github-issue`, `review-test`) — all domain review skills merged inline into `deep-review/SKILL.md`, dispatched via the `## Review Domains` table; `review-devin-global-harness` = the tooling-package exception (has real `src/`/`scripts/`/`workflows/`); knowledge other skills read cross-cuttingly (living docs, catalogs, boilerplate) → the `references/` of the canonical owner skill, or inline in the owner's SKILL.md (e.g. `deep-review/SKILL.md`, `follow-my-techstack/references/`) — there is no `shared/` at the repo root

`follow-create-*` package = a single `SKILL.md` only — no `references/`; version pins/doc links are never pinned in the file (goes stale fast) — Execute must have a "run /deep-research + /follow-best-practice" step to live-check the latest versions/practices before every implement; necessary file structures/command patterns may be inlined in SKILL.md; condense the old references content into `## Execute`/`## Rules` before deleting the dir

### When To Split

1. `SKILL.md` >250 → move detailed content to `references/<topic>.md`, leaving the high-level workflow + pointer; multiple responsibilities → split into `references/`; multiple execute patterns → `templates/`; content duplicating another skill → merge; very different goals → `workflows/` or `SKILL.md ## Subagents` per the matrix
2. How: identify the excess/duplicated part → create the sub-file → replace with a short pointer → update internal links → `/review-devin-global-harness` + `/deep-validate`

### Workflows And Subagents

| Content | Goes to |
|---------|-------|
| Read by the parent as context/lookup (docs, checklists, snapshots) | `references/` |
| Separately invocable workflow with its own Goal/Execute | `workflows/` |
| Independent work needing separate context, parallelism, or custom tools/model | `workflows/` with `subagent: true`/`agent:` or `SKILL.md ## Subagents` |
| Mechanical/deterministic work | `scripts/` |

Workflows: `workflows/<name>/SKILL.md` follows the same spec as a normal skill, `name` = `<parent>-<name>`; the runtime does not register them as `/command` — the parent dispatches via `argument-hint` + dispatch table; self-contained work → `subagent: true`/`agent:`

Lifecycle prefixes (use when there really are multiple lifecycles — a single workflow/knowledge item → `references/`): `setup-` first-time install/config · `config-` edit config without clobbering · `follow-` best practices for a sub-domain · `optimize-` measure baseline before/after · `improve-` raise quality, preserve behavior · `update-` minimal diff, idempotent · `deploy-` deploy until live + verified · `migrate-` move with rollback · `integrate-` bridge/pipeline · `verify-` post-action check for a domain · `check-` read-only domain check (parent `check-*` → bare name) · `report-` special report format · ~~`fix-`~~ retired → `## Fix` (`deep-review/SKILL.md`)

Consolidation: several top-level skills doing the same work in one domain → move them to `parent/workflows/<domain>/`, the parent becomes the dispatcher, bulk-update callers `/old` → `/parent` + verify no dangling refs before deleting the old dir; conversely, a workflow intended as standalone → promote to `<parent>-<domain>`; never use `workflows/` for pure knowledge → `references/`; never duplicate content across both `references/`+`workflows/`; merged skills' workflows go to `workflows/`, not `references/`; always `/update-references` after a move

Subagents: no `subagents/` folder — profiles stay inline under `## Subagents` in the parent's `SKILL.md` (one `### <role>` per profile: `Inputs`/`Tools`/`Execute`/`Output`/`Constraints`) and enforce `SKILL.md` ≤250 lines; a profile too detailed → keep the full version at `references/subagent-<name>.md` and link from that block; the runtime doesn't register these profiles directly — they must be materialized as agents via `/update-devin-global-subagents` into `.devin/agents/`, `.agents/agents/`, `~/.config/devin/agents/` or `%APPDATA%\devin\agents\`; a role already exists (`reviewer`, `qa`, `security-auditor`) → reference `agent:` directly, never create a new one; permission/model/tool semantics go in `Constraints`/`Tools` instead of frontmatter

Profile `skill-updater` (bulk update): inputs `skill`, `instructions`, `conventions`, `references?`; tools read/write/edit/exec/grep; read the package → apply instructions with minimal diff → check callers (referenced sites need follow-up, don't fix them yourself) → validate frontmatter+≤250+no-placeholder → return a per-file result table + summary; constraints: change only your own skill, never touch `AGENTS.md`/`global_rules.md`, no commit, don't guess content

### Invoke Skills

- Delegate when another skill already owns it — `run /skill-name to <reason>` instead of copying steps; never copy another skill's `## Execute` (SSOT); inline only small steps no skill covers
- Syntax: unconditional `run /x to <reason>`; conditional `if <measurable condition> → run /x`; optional `use /x if needed`; pointer `see also: /x, /y` — always state the context passed along (paths, args, evidence)
- Ordering: Foundation → Dependencies → High impact → Critical path → High risk; respect `check` → `review` → `## Fix`; independent items → parallel per `/follow-parallel`
- `related` contract: every entry has a real dir + is mentioned in the body; invocations should be in `related` (≤15); never list yourself/duplicates; A calls B → consider a reverse link; on change → `/update-references` both directions
- Limits: nested dispatch ≤2 levels (deeper → a `deep-*` orchestrator or `/use-subagents`); ≤~5 skill calls per step; never call yourself/deprecated; heavily overlapping scope → merge instead of long chains
- Validate: read the target SKILL.md to verify the contract → `/review-devin-global-harness` (cycles + broken refs) → `/deep-validate`

### Write References

Every skill with dependencies must have `references/` (mandatory, never skip — except `follow-create-*`/`review-*`, which `Directory Structure` defines as a single `SKILL.md` → merge this same content into `SKILL.md` condensed instead) — every dependency gets its own file written from real `/learn-from-web`/`/learn-from-cli`/`/check-types-definition` output (no placeholder/TODO — learning without writing = failed task):

- Each file must contain: the real install command, stable version (published ≥7 days — avoid `latest`/`*`/unbounded `>=`), peer deps, config + examples from official docs, source URL, migration steps if breaking changes exist; optional deps → ask before installing
- `follow-lib-*`/`follow-service-*`/`follow-tool-*` → `references/` has only `apis.md` + `cli.md` (only for tools with a real CLI) — no other files; both files are tables only, no prose sections — `apis.md`: metadata table `| key | value |` (package, install cmd, stable version ≥7 days, license, docs/repo URL) + API table `| api | description | signature/example |`; `cli.md`: `| command | description | options |` (+ `| flag | default |` if needed)
- `follow-lib-*`/`follow-tool-*` must have `best-practices/` (flat `.md` per topic — recommended patterns, pitfalls, do/don't, perf notes written from real `/learn-from-web`+`/deep-research`, not placeholders; no version pins — live-check via `/deep-research` at use time) — separate from `references/` because it's guidance, not API/CLI tables; `SKILL.md` must have a pointer to `best-practices/` in `## Scope` or `## Rules`
- Other skills with dependencies (not `follow-lib-*`/`follow-service-*`/`follow-tool-*`/`follow-create-*`/`review-*`) → `references/<dep>.md` per dependency as before — main content as tables per above
- After writing → `/check-reference`

### Src

CLI/terminal/web/browser/MCP → create `src/`: CLI → `/follow-create-cli` (Rust or Bun/TS); web → `/deep-review` first + `/visualize-in-web` HTML entry; MCP → `/follow-create-mcp` (try Rust) + update `mcp_config.json`; test dev/build/run per stack; helper scripts → `/use-scripts`; has `src/` → `/convert-git-submodules` + `/ship` after validation

### Create From URL

User sends a URL/domain → create parent + workflows:

1. Single URL → `/webfetch`; domain → `/web_search` for key pages; several URLs → `run_subagent` in parallel ≤10/batch (deep crawl → `/learn-from-web` ≤20 URLs/batch); summarize each page: topics, commands, config, examples — official docs only
2. Group by workload → `workflows/<domain>/<workflow>/SKILL.md` named `<domain>-<workflow>`; parent `<domain>-workflows/SKILL.md` dispatches by argument — `related` lists every workflow; start with parent + 3-5 workflows, don't over-create before user confirmation; validate → `/deep-validate` + `/check-reference` + `/git-commit` + `/report`

### Skill Usage Audit

Audit dead/dying skills (argument `usage`/`skill-usage` — read-only): parse `related:` from every `SKILL.md` → count inbound + `/review-devin-global-harness`; classify Orphaned (0 inbound + not referenced in `AGENTS.md`/`global_rules.md`), Leaf (0 inbound but an entry-point — not dead), Hub, Self-referencing; flag overly broad/duplicate ones; report via `/report` with columns No./Skill/Inbound/Tier/Recommendation (`keep`/`integrate`/`merge`/`delete`) — "0 references ≠ worthless"; deletion must go through `/delete` + `/update-references`

### Living Documents

Documents storing data (not workflows) — sync immediately when what they reference changes:

| Document | Path | Sync When |
|----------|------|-----------|
| CLI inventory | `check-my-global-cli/references/global-cli-commands.md` | tool newly installed / list older than 30 days |
| Tool map | `check-my-global-cli/references/tool-map.md` | skill/tool added/removed/merged |
| Tech catalog | `../follow-my-techstack/references/techstack-catalog.md` | new dep chosen / lib EOL / major release |
| Skills index | `skills/AGENTS.md` | skill added/removed/merged/renamed |
| Subagent registry | `use-subagents/SKILL.md` | profile added/removed in any skill's `SKILL.md ## Subagents` |
| `related:` frontmatter | every `SKILL.md` | a referenced skill merged/renamed/deleted |

Triggers: `mise use -g`/`scoop install` → 1+2; create skill → 2,4,6; delete/merge → 2,4,5,6; rename → 4,6 + every referencing file; new dep → 3. Verify: `rg "<old-name>" skills/` — only intentional mentions remain (e.g. "merged from …")

## Rules

### 1. Single Responsibility And Refactor

- Every file in a skill package ≤250 lines; `SKILL.md` = entry point holding the high-level workflow + pointers; split sub-files per `## Conventions → When To Split`/`Directory Structure`; content duplicating another skill → merge into the existing one

### 2. Official Sources And Evidence

- Use official docs, changelog, repository as the primary sources — don't use third-party when an official source exists, and state source URLs; every change has evidence + record the researched version — never guess APIs, commands, or versions

### 3. Safety

- Dry run before destructive/high-risk actions; overwriting an existing file → user confirmation; never break references or existing skills; `permissions` must list `deny` for risky system paths; no secrets/credentials in prompts

### 4. Content Standard

- How-tos reference actually installed CLI tools (inventory `check-my-global-cli/references/global-cli-commands.md`, map `follow-skills-map/references/tool-map.md`) — never hand-write scripts when a CLI can do it; none exists → `/deep-research` to find one or `mise use -g`
- `name` matches directory name, `description` ≤100 characters; no TODO/MOCK/placeholder — flag uncertainty explicitly; global skills are written in English (technical terms stay English); no `**` bold; use `/check-reference`, `/follow-single-of-source` when needed
- Install commands per ecosystem: `bun add`/`bun install` (JS/TS — default), `cargo add` (Rust), `go get` (Go), `pip install` (Python), `mise use -g npm:<package>` global npm CLI — avoid floating ranges

## Expected Outcome

- New/updated skills reflect the latest versions, APIs, commands, and best practices; deprecated items removed; `SKILL.md` passes `/deep-validate`, ≤250 lines, no TODO/MOCK/placeholder; `related` complete with no missing/unused entries
- References fully updated across `AGENTS.md`, `global_rules.md`, and related skills; `/report` summarizes findings and changes
