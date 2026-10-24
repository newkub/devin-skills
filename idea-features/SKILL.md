---
name: idea-features
description: Generate 30 required/optional feature idea tables, then implement via implement-to-production
argument-hint: "[topic]"
related:
  - idea
  - validate-idea
  - design-cli-prototype
  - design-tui-prototype
  - design-html-prototype
  - design-web-prototype
  - learn-from-codebase
  - reframe
  - ask-me
  - suggest-next-action
  - implement-to-production
  - create-plan-in-dot-agents
  - improve
  - bench-competitors
---

## Goal

Generate 30 feature ideas for a project/topic as two chat tables — `Required` (what the product must have first) and `Optional` (what can ship later) — covering 13 dimensions (uxui, feedback, responsive, onboarding, rbac, motion, animation, interactive, perf, security, resilience, stickiness, realtime), create no files, and hand every confirmed feature to `/implement-to-production`

## Scope

- output = two tables in chat only — no web viewer, no `ideas.json`, no writing files to temp, skill dir, or the target repo
- `Required` = without it the product is broken, incomplete, or unsafe for its stated users; a real user hits its absence in the first session
- `Optional` = improves outcomes after the required set exists; can ship later without breaking trust
- ideas that are gap-fixes for the existing implementation → `/improve features`; need market evidence for net-new → `/bench-competitors`
- need to screen which idea "should actually be done" before planning (demand/feasibility evidence + verdict) → `/validate-idea`
- don't implement ideas here — confirmed ideas go to `/create-plan-in-dot-agents`, then every feature is built strictly through `/implement-to-production`
- an idea the user has chosen but hasn't designed yet → design before planning: `/design-cli-prototype` / `/design-tui-prototype` (answer in chat) or `/design-html-prototype` / `/design-web-prototype` (when you need to see the visual), then `/create-plan-in-dot-agents`
- purely UX/UI without targeting the feature set → `/idea-uxui` instead

## Execute

### 1. Understand Context

> Goal: Ground the ideas in the real project before thinking of any

1. Take `<topic>` from the argument or conversation context — if unclear → `/ask-me`
2. Run `/learn-from-codebase` in a lightweight way — look at routes, commands, and the target project's main features
3. Read the manifest + structure to know the architecture pattern — never guess paths/surfaces in the Usage column
4. Propose topic clusters (e.g. reporting, ux, data, mobile, privacy, workflow) — if too broad, `/ask-me` multi-select; default: spread the 30 ideas across all clusters
5. Note the product's stated users and the trust level it needs (anonymous, team, admin, tenant) — this decides what counts as Required

### 2. Cover The 13 Dimensions

> Goal: no blind spot in the idea set

Every dimension must appear at least once across the 30 ideas:

| Dimension | Covers |
|-----------|--------|
| `uxui` | hierarchy, layout, component states, visual consistency, accessibility affordances |
| `feedback` | loading, empty, error, success, optimistic UI, toasts, progress |
| `responsive` | breakpoints, mobile-first flows, touch targets, adaptive layout |
| `onboarding` | first run, guided setup, sample data, empty-state paths, tutorials |
| `rbac` | roles, permissions, tenant/org scoping, audit visibility, least privilege |
| `motion` | page/list transitions, enter/exit, reduced-motion paths |
| `animation` | micro-interactions, skeletons, transitions between states |
| `interactive` | inline edit, drag-drop, keyboard shortcuts, command palette |
| `perf` | bundle, render, query, caching, latency budgets |
| `security` | auth hardening, input validation, rate limits, secrets, headers |
| `resilience` | retries, offline, degradation, partial failure, recovery |
| `stickiness` | notifications, saved views, personalization, re-engagement loops |
| `realtime` | live updates, presence, subscriptions, optimistic sync |

If the target genuinely has no justified idea for a dimension, do not invent filler — list the dimension below the tables with a one-line reason.

### 3. Generate 30 Ideas

> Goal: 30 rows with all columns filled, no placeholders

Always generate `30 items`, mixing `extends` + `new` + `platform`, and split them into `Required` and `Optional` by the definition in Scope:

| Column | Content |
|---------|---------|
| No. | 1–30 continuous — Required starts at 1, Optional continues the sequence |
| Features | Short, concise idea name |
| Description | What it is and what it does; 3–5 bullets, `<br>` for line breaks |
| Why | The pain/motivation behind it, grounded in real context — never generic |
| Benefit | The concrete outcome for the user/team/system |
| Usage | The real entry point (route, command, API, flow) from the target's actual structure |
| Tags | `kind` (`extends`/`new`/`platform`) + dimension from the table in step 2 |
| Impact | High = changes real outcomes / Medium = clearly better / Low = nice-to-have |
| Risk | Main risk (short): security, complexity, breaking change, dependency, migration |

### 4. Sort And Answer In Chat

> Goal: Two tables, read in the order work should happen

1. Order Required first, Optional second — never interleave them
2. Sort each table by `Impact` (High → Medium → Low); within the same impact, put ideas that unlock other ideas first, then lower `Risk`/effort first
3. Renumber `No.` continuously after sorting — Required 1..N, Optional N+1..30
4. Answer in chat as two markdown tables with the same 9 columns, plus a one-line reason for any uncovered dimension
5. End with a short summary: Required/Optional counts, High-impact count per dimension, and the top 3 Required ideas to start with + reasons
6. Run `/suggest-next-action`; confirmed ideas → `/create-plan-in-dot-agents`

### 5. Implement Through The Canonical Pipeline

> Goal: every confirmed feature is built the same way

1. When the user confirms a feature, do not code it ad hoc — route to `/create-plan-in-dot-agents`
2. Implement strictly via `/implement-to-production` (`baseline → implement with TDD → refactor → verify gate`)
3. After implementation, re-check the same dimension with `/improve <dimension>` when the feature changed UI, security, perf, or realtime behavior
4. Never claim a feature shipped without `/implement-to-production`'s verification gate passing

## Rules

- Always 30 ideas — never fewer; every column has a real value, no placeholders
- Exactly two tables — `Required` then `Optional`; one merged table is a spec violation
- All 13 dimensions must be represented (or explicitly justified as not applicable) before answering
- `Required` must be defensible: if remove it and a first-session user is blocked, broken, or unsafe, it belongs there — otherwise it is `Optional`
- Chat only — never create viewer/data/report files; a report file needs `/create-report-to-dot-agents` separately
- `new` must be a genuinely net-new capability (new flow/module/integration/surface) — filling a gap in what exists = `extends`
- Every Description/Why/Usage references the target project's real context — never propose a feature that conflicts with the existing architecture
- Implementation is always `/implement-to-production` — never hand-wave, never a separate ad-hoc flow
- Use `/reframe` if the ideas are stale or stuck in the same frame

## Expected Outcome

- Two chat tables: `Required` then `Optional`, 30 ideas total × 9 columns, each sorted by impact and dependency order
- All 13 dimensions covered (or explicitly justified), with kind proportions and the top 3 Required starters
- No files created by this skill
- Every confirmed feature routed to `/create-plan-in-dot-agents` and implemented via `/implement-to-production`
