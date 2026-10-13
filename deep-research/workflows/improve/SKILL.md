---
name: deep-research-improve
description: Research improvement opportunities — best practices, alternatives, issues → improve-*/deep-review
argument-hint: "[area-or-topic]"
related:
  - deep-research
  - follow-improve
  - follow-optimize
  - deep-review
  - deep-review-then-fix
  - improve-devin-global-skills
  - report
---

## Goal

Research improvement opportunities for a given project/area — current best practices, modern alternatives, known issues/pitfalls, benchmarks — then hand the findings to the `/follow-improve` convention (review → confirm → fix)

## Scope

Use when you want research-driven improvement — e.g. "is this stack still current", "is there a better pattern", "new tools that replace the current ones" — not a codebase scan (that is `/deep-review`); this is external research compared against what you already have

## Execute

### 1. Define Improvement Area

> Goal: Decide what to improve and what to compare it against

1. Identify the area: dependency, pattern, tool, config, architecture, performance approach
2. Record the current state from the codebase (`/scan-codebase`, manifest, existing config)
3. If the area matches an `improve-*` domain → note the domain to route findings at the end

### 2. Research Current Best Practices

> Goal: Learn what "good" looks like right now

1. Run the general pipeline of `/deep-research`: official docs, changelogs, migration guides, benchmarks
2. Find modern alternatives + deprecation notices for what is in use (`/deep-research dependencies` for deps, `/research-setup-integrations` for integrations)
3. Collect known issues/pitfalls from GitHub issues, RFCs, community comparisons

### 3. Gap Analysis

> Goal: Compare current vs best practice as a findings list

1. Build a findings list: `Gap`, `Current`, `Best Practice`, `Evidence/Source`, `Impact`, `Effort`
2. Group by `improve-*`/`optimize-*` domain or the matching `/deep-review` review domain
3. Separate quick wins from structural changes

### 4. Hand Off To Improve Flow

> Goal: Feed the findings into the improvement convention

1. Produce a `/report` table of findings with sources
2. Route per `/follow-improve` — findings matching a domain → that `improve-*` skill; no match → `/deep-review` domain + `/deep-review-then-fix` after user confirm
3. If this is this repo (devin skills) → `/improve-devin-global-skills`

## Rules

- Findings must have evidence + source + version/year — never propose an improvement without a basis
- Research only — no edits in this workflow; fixes go through the `/follow-improve` convention after user confirm
- Verify current-state claims against the real codebase before comparing — don't guess
- Use `/deep-review`, `/follow-optimize` if needed

## Expected Outcome

- Findings table: gaps vs best practices with evidence, impact/effort, routed to the correct improve path
