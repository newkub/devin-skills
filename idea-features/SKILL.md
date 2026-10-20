---
name: idea-features
description: Generate 30 feature ideas (extends + new + platform) — answer with a single table in chat, ordered by impact, create no files
argument-hint: "[topic]"
related:
  - idea
  - validate-idea
  - design-cli-prototype
  - design-tui-prototype
  - design-html-prototype
  - design-web-prototype
  - deep-analyze
  - learn-from-codebase
  - reframe
  - ask-me
  - suggest-next-action
  - implement-to-production
  - create-plan-in-dot-devin
  - improve
  - bench-competitors
---

## Goal

Generate 30 feature ideas for a project/topic — covering `extends` (extend what exists), `new` (net-new capability), and `platform` (cross-cutting: auth, security, performance, stability, release, observability) — answer in chat as a **single table** ordered by impact, create no files at all

## Scope

- output = a table in chat only — no web viewer, no `ideas.json`, no more writing files to temp/skill dir/target repo (the old model has been removed)
- ideas that are gap-fixes for the existing implementation → `/improve features`; need market evidence for net-new → `/bench-competitors`
- need to screen which idea "should actually be done" before planning (demand/feasibility evidence + verdict) → `/validate-idea`
- don't implement ideas — ideas the user confirms always go to `/create-plan-in-dot-devin`, then `/implement-to-production`
- an idea the user has chosen but hasn't designed yet → design before planning: `/design-cli-prototype` / `/design-tui-prototype` (answer in chat) or `/design-html-prototype` / `/design-web-prototype` (when you need to see the visual), then `/create-plan-in-dot-devin`
- purely UX/UI without targeting the feature set → `/idea-uxui` instead

## Execute

### 1. Understand Context

> Goal: Understand the topic and the real project before thinking of ideas

1. Take `<topic>` from the argument or conversation context — if unclear → `/ask-me`
2. Run `/learn-from-codebase` in a lightweight way to ground the ideas in the real codebase — look at routes, commands, and the target project's main features
3. Read the manifest + structure to know the architecture pattern — never guess paths/surfaces in the Usage column
4. Propose topic clusters (e.g. reporting, ux, data, mobile, privacy, workflow) — if too broad, `/ask-me` multi-select to choose clusters; default: spread the 30 ideas across all clusters

### 2. Generate 30 Ideas

> Goal: 30 ideas with all columns filled, no placeholders

Always generate **30 items**, mixing `extends` + `new` + `platform` according to the proportion of the chosen topic — every row of the table must have all 9 columns:

| Column | Content |
|---------|---------|
| No. | 1–30 (continuous after sorting) |
| Features | Short, concise idea name |
| Description | What this idea is and what it can do; 3–5 bullets, can break lines with `<br>` |
| Why | The pain/motivation behind it, supported by real context — never generic |
| Benefit | The concrete outcome the beneficiary (user/team/system) gets |
| Usage | The real way to use/enter the feature (route, command, API, flow) per the target's real structure |
| Tags | `kind` (`extends`/`new`/`platform`) + category e.g. `auth`, `dx`, `perf` |
| Impact | High = changes real outcomes / Medium = clearly better / Low = nice-to-have |
| Risk | The idea's main risk (short): security, complexity, breaking change, dependency |

### 3. Sort And Answer In Chat

> Goal: One table, read in order of importance

1. **Sort by Impact: High → Medium → Low** — within the same impact, put `new`/`platform` that unlock other work first; renumber `No.` after sorting
2. Answer in chat as a **single markdown table** with all 30 rows — no grouping, create no files, serve nothing
3. End with a short summary: the proportion of extends/new/platform, the number of High-impact, the top 3 ideas recommended to start with + reasons
4. Run `/suggest-next-action` — ideas the user confirms → `/create-plan-in-dot-devin` → `/implement-to-production`

## Rules

- Always 30 ideas — never fewer; every column has a real value, no placeholders
- Chat only — never create viewer/data/report files; if the user wants a report file → use `/create-report-in-dot-devin` separately
- `new` must be a genuinely net-new capability (new flow/module/integration/surface) — filling a gap in what exists = `extends`
- Every Description/Why/Usage references the target project's real context — never propose a feature that conflicts with the existing architecture
- Use `/reframe` if the ideas are stale or stuck in the same frame

## Expected Outcome

- A single table in chat: 30 ideas × 9 columns (No., Features, Description, Why, Benefit, Usage, Tags, Impact, Risk) ordered by impact
- A clear kind proportion (extends/new/platform) and 3 recommended starter ideas with reasons
- No files are created in this process
