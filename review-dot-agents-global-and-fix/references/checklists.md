# Review Checklists

Canonical definitions for every check in `review-dot-agents-global-and-fix`. Workflows point here instead of restating a rule.

## Package Checks

- frontmatter: `name` = dir (Critical if missing or mismatched), `description` ≤100 (Low if over), `related` missing or unused (High), a `related` entry never mentioned in the body (Medium), abnormal circular chain (High)
- sections: `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome` — missing = Critical, wrong order = High; `## Execute` ≤10 steps (Medium), `### N.` + `> Goal:` + a numbered list (missing Goal = High, bullets instead of numbers = Medium)
- line count: missing `SKILL.md` = Critical; `SKILL.md` far over 250 = Critical, other files over 250 = Medium, 251-260 = Low; TODO/MOCK/placeholder = High; `references/` kebab-case and flat, has deps but no `references/` = Medium
- style: backticks for tools, commands, paths, skill names (Medium), no `**` bold (Medium), English Title Case headings (Low), Thai prose instead of English (Medium)
- template: prefix ↔ execute pattern per `update-agents-skills-global` `## Conventions → Templates`; mismatch without a stated reason in `## Scope` = High, unclear reason = Medium

## Content Quality

- simplify: `/simplify` ∥ `/deep-review` domains `simplify` and `redundancy`; Execute↔Rules overlap → delete; Rules duplicating another skill → reference it; coverage gaps → `/deep-review` domain `gaps`
- high impact: every bullet answers "if removed, does the outcome change" — no change → delete; no TODO, MOCK, placeholder, or non-actionable filler
- clarity: active voice with explicit subject and object, validation criteria measurable (threshold, expected, pass-fail, retry limit), no unstated assumptions; ambiguous → rewrite and recheck up to 3 times
- severity: Critical = TODO/MOCK/unfollowable; High = Execute↔Rules duplication or missing criteria; Medium = filler or passive voice; Low = can be tighter

## Parallel And Scripts

`parallel:` and `∥` only inside `## Execute` numbered lists — used in Rules, checklist, or Expected Outcome = High; parallel operations must have no real dependency (High); operations over 10 files → `/use-scripts` (missing = Medium); workflow over 5 steps or high risk → `/follow-context-engineering`; missing parallel markers where safe = Low

## Hooks

Config: `~/.agents/hooks/hooks.json`, the client mirror `%APPDATA%\devin\config.json` → `hooks`, and `<project>/.agents/hooks/` — checks: correct event (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `Stop` only — High), command path exists and is executable (Critical), matcher not overly broad (Medium), no global plus project duplication (Medium), no infinite loop (a hook calling the tool that triggers it — Critical), blocking ≤30s (High), a failing hook does not unintentionally block (High), no embedded secrets (Critical); report No./Hook/Event/Finding/Severity/Evidence with config path and line

## Mcp

Config: `~/.agents/mcp/mcp_config.json` plus the project `.agents/mcp/mcp_config.json` — checks: server responds and the `npx` package exists (Critical), env vars complete and not placeholders (High), no duplicate server (Medium), tool names do not collide (High), no dead config (Medium), correct scope global versus project (Low), unused server (Low), `@latest` in `npx` as a supply chain risk (High); report No./Server/Transport/Finding/Severity/Evidence; never log secrets — state only missing or present

## Artifact Alignment

After changing rules, architecture, deps, skills, or docs → inventory `AGENTS.md`, `README`, `USAGE`, `package.json`, and the skill catalog, recording version and last-updated → detect misalignment (broken, stale, or circular refs, terminology drift, docs versus code) → align rules via `/update-devin-global-rules`, docs via `/update-agents-md`, `/update-readme-md`, `/update-usage-md`, code via `/deep-review` plus `/check-code-structure` → `/deep-validate` plus typecheck, lint, scan, tests → report Artifact/Before/After/Status; a rules-versus-code conflict → `/ask-me` to ask which side wins; detect before fixing, minimal scope, rename or move → `/update-references`, never create circular refs

## Redundancy

1. Inventory: `/scan-codebase` lists every skill with name, description, files, size grouped by prefix, plus a purpose summary from `description` and `## Goal`
2. Detect four ways: duplicate purpose (`description`/`## Goal` overlap over 70%, or different prefix but near-identical purpose); overlapping scope (`## Scope` says "not" but the steps do the same thing, `related` point at each other, `## Execute` largely identical); redundant content (hash blocks over 50% match, compare `## Rules` and `## Expected Outcome`); unused (`/check-reference` plus `AGENTS.md` → standalone versus orphan)
3. Recommend: duplicate → merge via `/idea-merge`, rename, or split; scope overlap → adjust `## Scope`; repeated content → move to `references/`; unused → keep, document, or remove — report skill/issue/action/priority plus `/suggest-next-action`
4. Confirm and execute: `/ask-me` always first; merge → re-review, rename → `/update-references`, remove → `git rm` plus `/update-references`; `/deep-validate` after every action
5. Fix flow: detect → classify (deps → `/deep-review` domain `dependencies`, pattern → domain `redundancy`, large volume → `/follow-tool-jscpd`) → pick the canonical (most used, most test coverage; unclear → `/ask-me`) → replace with a reference → `/run-check` plus `/run-test` per batch → report No./Duplicate Type/Canonical/Files Fixed/Status; never delete intentional redundancy, fix one dimension at a time

## Refactor Guide

Categories: split (over 250 lines or multiple responsibilities), merge (overlapping scope — preserve intent, delete the absorbed one), restructure (≤10 steps), deduplicate (into `references/` or `related`), relocate. Priority: high redundancy → large files → broken structure; compare change frequency and usage, do not over-refactor; new sub-skills → `/new-skills` one at a time; consistency → `/deep-review` plus `/update-references` plus complete bidirectional refs

## References Integrity

1. Inventory: `/list-dot-agents-global` domain `skills` → name and dir of every skill; compare against `AGENTS.md` — skills missing from the catalog, entries with no dir, wrong category
2. Frontmatter `related`: every entry has a real skill; in body, every `/skill-name` and backticked ref resolves (keep false positives for common tools)
3. Circular: build a graph from `related` plus in-body refs → cycles (A→B→A) and self-refs with the path — the script does not check this
4. Global rules: refs in `AGENTS.md` have real skills, and skills referencing the rules have matching rules
5. Report: No./Type/Source/Target/Severity/Action sorted Critical→Low, marking auto-fixable versus manual → `/suggest-next-action`

## Context Rot

- stale: version pins, `(verified YYYY-MM-DD)` markers older than 90 days, deprecated commands, dead links → route to `/update-agents-skills-global` or the matching `update-*-md`
- incorrect: `/check-reference` on recently edited or high-traffic skills; unverified claims → Warning
- dead weight: skills or subagents never invoked, orphan `references/` not linked from the SKILL.md, `related` pointing at deleted skills
- bloat: SKILL.md near 250 → split into `references/`; `references/` over about 1500 lines → consolidate; `related` over 15 → cut to what is necessary
- severity: a command or API unusable in an active skill = Critical; a version pin older than one major or orphan refs = Warning; bloat or an old but still-correct marker = Info

## Scoring

- weights and grade: per `/report-review` step 3 (the SSOT) — score is a weighted average of findings; never restate the formula here
- thresholds: score under 70 → recommend the related `update-*` or `/update-references` before proceeding; under 50 → stop and report only
- report: No./Skill/Layer/Category/Severity/Finding/Evidence/Action — every finding needs a file path and evidence → `/suggest-next-action`
- metrics: coverage %, false positive %, evidence strength %, actionability %, severity distribution, MTTR (C=1d, H=3d, M=7d, L=14d average), before and after trend, risk exposure (Critical and High in core scope); per-layer domain metrics such as duplication rate, broken ref rate, template compliance %
