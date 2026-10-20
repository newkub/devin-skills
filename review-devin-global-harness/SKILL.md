---
name: review-devin-global-harness
description: Review the whole devin harness — skills, subagents, hooks, MCP, rules — aligned
argument-hint: "[skills|subagents|hooks|mcp|rules|broken-refs|relations|all]"
allowed-tools:
  - exec
  - read
  - grep
  - glob
  - find_file_by_name
  - ask_user_question
related:
  - update-devin-global-skills
  - follow-single-of-source
  - deep-validate
  - follow-deep
  - check-reference
  - update-devin-harness
  - deep-review-codebase
  - update-references
  - use-subagents
  - simplify
---

## Goal

Review the whole devin harness — `skills`, `subagents` (`%APPDATA%\devin\agents`), `hooks`, `MCP servers`, `global rules` — so they are aligned and consistent with no redundancy, before calling `update-devin-global-* / update-devin-project-*` — all checklists live in `## Checklists`

## Scope

Use before calling `update-devin-global-* / update-devin-project-*` — covers 5 layers:

- `skills` — check skill packages against the `update-devin-global-skills` standard (frontmatter, sections, line count, style)
- `subagents` — check `AGENT.md` against the `update-devin-global-subagents` standard
- `hooks` — check hooks config triggers the right event, doesn't block workflow, and commands actually exist
- `mcp` — check MCP servers are enabled/actually used, don't duplicate a server, and aren't dead config
- `global rules` — check `global_rules.md` — referenced skills exist, no conflicts, not stale

Cross-layer checks: `alignment` (rules↔skills↔subagents reference each other correctly), `redundancy` (duplicate purpose/scope/content/unused), `references integrity`, `context rot` (stale/incorrect content, dead weight, context bloat), `coverage` (domains/actions with no skill yet — `/deep-review-codebase`)

Do not create new skills (use `/update-devin-global-skills`); do not fix code (use `/deep-validate`)

## Execute

### 1. Prepare Context
> Goal: inventory every layer of the harness

1. Run the deep pre-pass per the `review-*` convention (`update-devin-global-skills` `## Conventions → Templates`): `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first, then `/scan-codebase` in the skills dir → list all skills grouped by prefix → read `update-devin-global-skills` + `AGENTS.md` + `global_rules.md` to know the current standard
2. Collect the inventory: skills dirs, `%APPDATA%\devin\agents\*` (AGENT.md), hooks config, MCP config, `global_rules.md`

### 2. Run Review Script
> Goal: get findings from automated checks

1. Run `bun run review` in the skill directory — the scripts in `src/` check frontmatter, sections, line count, style, references, parallel markers and cross-skill checks — the script covers only the skills layer mechanically; hooks/mcp/global rules/template compliance have no script and must be manual only
2. Use `bun run review:ci` for the pre-check before `update-devin-*` (exit 1 on Critical/High)
3. Read `review-skills-report.json` to see all findings — script findings are input for Step 3, not the final result

### 3. Review Each Layer
> Goal: check each layer against its own standard

1. `skills` → split the work: the script (Step 2) already covers mechanical checks — manual does only the interpretation/quality the script can't check, per `### Content Quality`; the criteria the script uses are in `### Package Checks`
2. `subagents` → check every AGENT.md in `%APPDATA%\devin\agents`: frontmatter, sections, line count, style, safety — same standard as skills; report a finding per agent
3. `hooks` → per `### Hooks`; `mcp` → per `### Mcp`; `global rules` → per `### References Integrity` item global rules — referenced skills exist, Execute order doesn't conflict, no stale skill names

### 4. Cross-Layer Alignment — follow `deep-review-codebase/SKILL.md` `alignment` (canonical)
> Goal: check layers reference each other correctly

1. `global_rules.md` references skills → every name has a real skill
2. skill `related` ↔ reverse related → symmetric
3. subagent profiles in skills ↔ `agents/` dir → match
4. `AGENTS.md` in the skills repo ↔ actual dirs → in sync

### 5. Interpret And Quality
> Goal: separate false positives and check content the script can't verify

1. Verify the evidence of each finding
2. Follow `### Content Quality` and `### Parallel And Scripts`
3. Run `/check-my-global-cli` to check that `check-my-global-cli/references/tool-map.md` is in sync with the actually installed tools

### 6. Plan And Execute Refactor
> Goal: split, merge, restructure, deduplicate, relocate per plan

1. Follow `### Refactor Guide` (plan → execute → cross-skill consistency)
2. Identify SKILL.md files that should be refactored — duplicated content, >250 lines, missing sections, blurred SRP → the list becomes action items

### 7. Redundancy Audit — follow `deep-review-codebase/SKILL.md` `redundancy` (canonical)
> Goal: find redundant or unnecessary skills/layers

Follow `### Redundancy` — inventory → detect ×4 → recommend → user confirm → score per `### Scoring`; remove/merge always requires user confirm

### 8. References Integrity
> Goal: check references are not broken/duplicated/looping across every layer

1. The script (Step 2) already checks mechanical ref existence — manual checks only semantics per `### References Integrity`
2. Score per `### Scoring`, report format per `### References Integrity` item report
3. Broken/duplicate refs → `/update-references` after user confirm

### 9. Context Rot And Coverage
> Goal: check content that decays over time and domain gaps

1. Follow `### Context Rot` — stale content (`/deep-review-codebase` domain `usage`), incorrect content (`/check-reference`), dead weight, context bloat
2. Run `/deep-review-codebase` domain `gaps` — check that the domains/actions the harness intends to cover actually have a skill supporting them, or list the gaps — merge findings into the report as separate `context-rot` and `coverage` sections

### 10. Score And Report
> Goal: summarize score per layer + findings + refactor plan

1. Score per `### Scoring` — severity weights, grade, report format
2. Run `/report-review` (table in chat, no files) with sections split by layer: `skills`, `subagents`, `hooks`, `mcp`, `global rules`, `cross-layer` — each with Skill/Layer, Category, Severity, Finding, Evidence, Action
3. Summarize "what else to improve" + "SKILL.md files to refactor" as a prioritized action list → `/suggest-next-action`

### Workflows
> Goal: dispatch a focused pass when the argument names a single layer (`[layer|all]`) — merged from the old `workflows/` (CLI tools moved to `scripts/`)

| Layer Arg | Focused Pass |
|-----------|--------------|
| `skills` | `bun run review` findings + a manual pass per `### Content Quality` (criteria the script uses = `### Package Checks`) — separate false positives; report No./Skill/Category/Severity/Finding/Evidence/Action |
| `subagents`, `agents` | inventory every `AGENT.md` in `%APPDATA%\devin\agents` — frontmatter/sections per `### Package Checks` + safety (appropriate permissions, no destructive defaults) + orphan agents (no skill references them — never delete without confirm) |
| `hooks` | per `### Hooks` — trigger/command/loop/duplicate/blocking; broken command + infinite loop = High |
| `mcp` | per `### Mcp` — enabled/env/duplicate/tool-name clash/dead config; never log secrets — state only missing/present |
| `rules`, `global-rules` | per `### References Integrity` item global rules — skill refs exist, Execute doesn't conflict, not stale |
| `broken-refs`, `references` | `bun scripts/broken-skills-references.ts [path]` (default `%APPDATA%\devin\skills`) — Critical = broken `related`, Warning = broken body `/skill-name`; filter URL/file-path/npm/placeholder false positives; report-only → fix via `/update-references` |
| `skills-related`, `relations` | `cargo build --release` in `scripts/skills-related/` then run `scripts/skills-related/target/release/check-skills-related.exe` — modes: `Summary` (default), `Quick`, `Tree` (`-Skill <name> -TreeDepth N`), `Cycles`, `Verify` (exit 1 on a cycle — CI), `Full`; report-only |

- Every focused pass is review-only — no edits during checks; every finding must have a path + evidence

## Checklists

### Subagent: harness-reviewer (merged AGENT)

A read-only reviewer contract for fan-out via `/use-subagents` — merged from the old `subagents/harness-reviewer/`:

- inputs: `scope` (target path/dir), `dimensions` (optional — a subset of dimensions), `findings-file` (optional baseline such as `review-skills-report.json`)
- dimension → checklist section: `frontmatter`/`sections`/`line-count`/`style`/`template-selection`/`checklist` → `### Package Checks`; `content-quality` → `### Content Quality`; `parallel-usage` → `### Parallel And Scripts`; `hooks` → `### Hooks`; `mcp` → `### Mcp`; `redundancy-*` → `### Redundancy`; `refs-*` → `### References Integrity` + `### Artifact Alignment`; `context-rot` → `### Context Rot`; `refactor-guide` → `### Refactor Guide`; `scoring`/`redundancy-scoring`/`refs-scoring` → `### Scoring`
- output contract: table `No. | Dimension | Severity | File | Finding | Suggestion` sorted Critical→Info + a score per dimension — report both strengths and weaknesses
- constraints: read-only (no edits — fixes live in `## Fix`), no evidence no finding, responsible only for the `dimensions` received

### Package Checks

- frontmatter: `name` = dir (Critical if missing/mismatched), `description` ≤100 (Low if over, Info if unclear), `related` missing/unused (High), a `related` entry never mentioned in the body = orphan (Medium), abnormal circular chain (High)
- sections: `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome` — missing = Critical, wrong order = High; `## Execute` ≤10 steps (Medium), `### N.` + `> Goal:` + numbered list (missing Goal = High, bullets instead of a numbered list = Medium)
- line count: missing `SKILL.md` = Critical; `SKILL.md` way over 250 = Critical, other files >250 = Medium, 251-260 = Low; TODO/MOCK/placeholder = High; `references/` kebab-case flat, has deps but no `references/` = Medium
- style: backticks for tools/commands/paths/skill names (missing = Medium), no `**` bold (Medium), English headings Title Case (Low), Thai prose instead of English (Medium)
- template: prefix ↔ execute pattern per `update-devin-global-skills` `## Conventions → Templates`; `follow-*-architecture` → architecture pattern; mismatch without a stated reason in `## Scope` = High, unclear reason = Medium

### Hooks

Config: `%APPDATA%\devin\config.json` (or `~/.config/devin/config.json`), `.devin/config.json`, `.devin/plugins/*/hooks.json` — checks: correct event (`PreToolUse`/`PostToolUse`/`UserPromptSubmit`/`SessionStart`/`Stop` only — High), command path exists + executable (Critical), matcher not overly broad (Medium), no global+project duplication (Medium), no infinite loop — a hook calls the tool that triggers it (Critical), blocking ≤30s (High), a hook failure doesn't unintentionally block (High), no embedded secrets (Critical); report per hook: No./Hook/Event/Finding/Severity/Evidence (config path+line)

### Mcp

Config: `config.json → mcpServers` global + project — checks: server actually responds / `npx` package exists (Critical), env vars complete and not placeholders (High), no duplicate server (Medium), tool names don't collide (High), no dead config (Medium), correct scope global vs project (Low), unused server (Low), pinning/`minimumReleaseAge` — `@latest` in npx = supply chain risk (High); report per server: No./Server/Transport/Finding/Severity/Evidence

### Content Quality

- simplify: `/simplify` ∥ `/deep-review-codebase` (domains `simplify`/`redundancy`) to tighten content; Execute↔Rules overlap → delete; Rules duplicating another skill → reference it; `/dont-over-engineer` sets the minimal boundary; coverage gaps → `/deep-review-codebase` (domain `gaps`)
- high impact: every bullet answers "if removed, does the outcome change" — no change → delete; no TODO/MOCK/placeholder/filler or pretty non-actionable wording; simplify must keep full context
- clarity: active voice with explicit subject/object, validation criteria measurable (threshold/expected/pass-fail/retry limit), no unstated assumptions; ambiguous → rewrite + recheck max 3
- severity: Critical = TODO/MOCK/unfollowable; High = Execute↔Rules duplication/missing criteria; Medium = filler/not active voice; Low = can be tighter

### Parallel And Scripts

`parallel:`/`∥` only inside `## Execute` numbered lists — used in Rules/checklist/Expected Outcome = High; parallel operations must have no real dependency (High); operations over >10 files → `/use-scripts` (missing = Medium); workflow >5 steps/high-risk → `/follow-context-engineering`; missing parallel markers where safe = Low

### Redundancy

1. Inventory: `/scan-codebase` lists every skill (name/description/files/size) grouped by prefix + a purpose summary from `description`+`## Goal`
2. Detect ×4: duplicate purpose — `description`/`## Goal` overlap >70% or different prefix but near purpose; overlapping scope — `## Scope` says "not" but they do the same thing, `related` pointing at each other, `## Execute` steps largely identical; redundant content — `/use-scripts` hash blocks >50% match between skills (compare `## Rules`/`## Expected Outcome`); unused — `/check-reference`+`AGENTS.md` → separate standalone vs orphan
3. Recommend: duplicate → merge (`/idea-merge`)/rename (`/rename`)/split; scope overlap → adjust `## Scope`; repeated content → move to `references/` or a shared reference; unused → keep/document/remove — report table skill/issue/action/priority + `/suggest-next-action`
4. Confirm+execute: `/ask-me` always first; merge → re-review, rename → `/rename`+`/update-references`, remove → `git rm`+`/update-references`; `/deep-validate` after every action
5. Fix flow (canonical): detect → classify (code/content/config/cross-skill — deps → `/deep-review-codebase` domain `dependencies`, pattern → `/deep-review-codebase` domain `redundancy`, large code volume → `/follow-tool-jscpd`) → pick the canonical (most used/most test coverage — unclear → `/ask-me`) → replace with a reference → `/run-check`+`/run-test` per batch → report No./Duplicate Type/Canonical/Files Fixed/Status; never delete intentional redundancy (backup/fail-over), fix one dimension at a time

### References Integrity

1. Inventory: `/list-devin-global-skills`/`/scan-codebase` → name+dir of every skill; compare against `AGENTS.md` — skills not in the catalog / entries with no dir / wrong category
2. Frontmatter `related`: every entry has a real skill; in-body: every `/skill-name`/backtick ref resolves (keep false positives for common tools)
3. Circular: graph from `related`+in-body → cycles (A→B→A) + self-refs with the path — the script does not check this
4. Global rules: refs in `global_rules.md` have real skills + skills referencing the rules have matching rules
5. Report: `/report table` No./Type/Source/Target/Severity/Action sorted Critical→High→Medium→Low, marking auto-fixable vs manual → `/suggest-next-action`

### Artifact Alignment

After changing rules/architecture/deps/skills/docs → inventory `rules/`+`sgconfig.yml`+`AGENTS.md`+`README`+`USAGE`+`package.json`+`global_rules.md` (record version/last-updated) → detect misalignment (broken/stale/circular refs, terminology, docs↔code) → align: rules → `/update-astgrep-rules`/`/update-dot-devin`/`sgconfig.yml`+`/run-scan`, docs → `/update-agents-md`/`/update-readme-md`/`/update-usage-md`, code → `/deep-review-codebase`+`/check-code-structure` → `/deep-validate`+typecheck/lint/scan+tests → report Artifact/Before/After/Status; rules vs code conflict → `/ask-me` asking the originating side; detect before fixing, minimal scope, rename/move → `/update-references`, never create circular refs

### Context Rot

- stale: `/deep-review-codebase` — version pins, `(verified YYYY-MM-DD)` markers (>90 days), deprecated commands, dead links → route `/update-devin-global-skills`/`update-*-md`
- incorrect: `/check-reference` on recently edited/high-traffic skills; unverified claims → Warning
- dead weight: skills/subagents never invoked, orphan `references/` (not linked from the SKILL.md), `related` pointing at deleted skills
- bloat: SKILL.md near 250 → split into `references/`; `references/` totalling >~1500 → consolidate; `related` >15 → cut to what's necessary
- severity: a command/API unusable in an active skill = Critical; a version pin older than 1 major / orphan refs = Warning; bloat / an old but still-correct marker = Info

### Refactor Guide

Categories: split (>250/multiple responsibilities), merge (overlapping/duplicate scope — preserve intent, delete the absorbed one), restructure (≤10 steps), deduplicate (→ references/`related`), relocate (`/relocation` per prefix); priority: high redundancy → large files → broken structure; compare change frequency/usage — don't over-refactor; new sub-skills → `/update-devin-global-skills` one at a time; consistency → `/deep-review-codebase` + `/update-references` + complete bidirectional refs

### Scoring

- weights: Critical=0 / High=25 / Medium=50 / Low=75 / Info=100 — score = weighted average of findings; grades A≥90 / B≥80 / C≥70 / D≥60 / F<60
- thresholds: score <70 → recommend the related `update-*`/`update-references` before proceeding; <50 → stop, report only
- report: `/report table` No./Skill/Layer/Category/Severity/Finding/Evidence/Action — every finding must have a file path + evidence → `/suggest-next-action`
- metrics: coverage %, false positive %, evidence strength %, actionability %, severity distribution, MTTR (C=1d/H=3d/M=7d/L=14d avg), before/after trend, risk exposure (C/H in core scope); domain metrics per layer such as duplication rate, broken ref rate, template compliance %

## Rules

### 1. Review Before Refactor

- Always run the review (Steps 1-5) before the refactor (Step 6)
- Every finding must have a layer, file path, evidence
- Do not modify the harness during review — fix in the refactor step

### 2. Whole-Harness Focus

- Cover every layer found in the inventory — never skip a layer without stating the reason
- Prioritize cross-layer alignment over perfection in a single layer
- Preserve the original intent of each skill/subagent/rule

### 3. Non-Redundancy

- Use the checklists in this file instead of duplicating content
- No overlap between Execute and Rules
- Report the same finding that appears in 2 layers once, at the root cause

### 4. Safety Measures

- Create a commit checkpoint before refactoring
- Update `related`/`AGENTS.md`/`global_rules.md` after every split, merge, rename
- Destructive actions require a dry run and user confirmation

### 5. Scoring And Formatting

- Compute the review score per `### Scoring`, separately per layer
- Never use markdown bold markers — use backticks
- Report as tables via `/report-review` (chat, no files)

- Use /idea-new-devin-global-skills, /follow-deep, /deep-review-codebase, /run-review, /follow-single-of-source when needed
- Use /update-devin-harness when findings are layer misalignment; use /check-reference, /update-devin-global-skills to drill into a single layer

## Fix

> Follow `deep-review-codebase/SKILL.md` when the user confirms fixing findings — use /use-subagents if needed

## Expected Outcome

- Harness review report with score + grade per layer
- Findings with layer, severity, evidence, action — confirmed complete across every layer (skills, subagents, hooks, MCP, global rules)
- Cross-layer alignment passes, no broken/orphan references
- List of SKILL.md files that should be refactored + improve items with priority — recommend the next action via `/suggest-next-action`
