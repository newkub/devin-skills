---
name: validate-idea
description: Validate an idea before building — falsifiable claim, evidence, scores, GO/PIVOT/NO-GO verdict
argument-hint: "[idea-or-topic]"
related:
  - idea
  - idea-features
  - idea-uxui
  - idea-merge
  - deep-research
  - compare-competitors
  - bench-competitors
  - deep-analyze
  - reframe
  - prioritize
  - pick-bestest
  - ask-me
  - create-plan-in-dot-agents
  - report-review
  - suggest-next-action

---

## Goal

Decide whether an idea deserves building `before` any work — turn it into a falsifiable claim, gather evidence, score it, and return one verdict (`GO` / `PIVOT` / `NO-GO`) with the reasons and the next skill; answer in chat, write no files

## Scope

- Use for one idea (or up to ~3 compared side by side) coming from `/idea-features`, `/idea-uxui`, `/idea`, a user request, or a competitor gap
- More than ~3 ideas, or a ranked backlog wanted → `/prioritize` (this skill validates, that one orders)
- Not yet invented → `/idea-features` / `/idea-uxui`; already confirmed and just needs a plan → `/create-plan-in-dot-agents`; only a comparison of known competitors wanted → `/compare-competitors`
- Chat-only: verdict + tables in the reply; persist a report only on explicit request → `/create-report-to-dot-agents`

## Execute

### 1. Make The Idea Falsifiable

> Goal: an idea that cannot be wrong cannot be validated

1. Take the idea from the argument or the conversation; too vague to state a claim → `/ask-me` (one question set, then continue)
2. Restate it as a claim: `who` has `what problem`, this idea solves it via `what mechanism`, proven by `what measurable signal`
3. List the assumptions the claim depends on (demand, capability, willingness to pay/adopt, technical feasibility) — each labeled `known` (has evidence) or `assumption` (needs proof)
4. Cost tier from the assumptions: one file / one feature / one new product — the tier sets how much evidence `### 2` demands

### 2. Gather Evidence

> Goal: prove or break the claim with real sources, not opinion

1. Demand/problem: `/deep-research` for the stated problem, existing threads, docs gaps, issue reports; product-level idea → user/market signals
2. Existing solutions: `/compare-competitors` (or `/bench-competitors` when the plan is to implement anyway) — someone already doing it well is evidence, not disqualification
3. Feasibility in this repo: lightweight `/deep-analyze` — what files/skills/deps the idea touches, what blocks it, and what it would cost to build here
4. Registry/package ideas: `/search-npm-libraries` + `/run-bench-deps` before assuming a new dependency is needed
5. Record each finding as evidence with its source, or as `no evidence found` — never fill a gap with a guess

### 3. Score The Idea

> Goal: one comparable score per idea

1. Score 1-5 on each dimension, every score carrying its evidence: `Problem fit`, `Evidence of demand`, `Feasibility in this stack`, `Effort/cost`, `Risk` (maintenance, lock-in, security, reversibility), `Differentiation`, `Measurable success`
2. Verdict table columns: `No. | Dimension | Score | Evidence | Source`
3. Note the weighted view — demand and feasibility carry double weight; a low `Measurable success` means the idea cannot be validated later either
4. A hard blocker found anywhere (no authority to build on, requires a breaking architecture change, secret/compliance problem, no demand evidence for a high-cost tier) → mark it and skip straight to `### 4` as `NO-GO`/`PIVOT` regardless of the total

### 4. Give One Verdict

> Goal: a decision, not a summary

1. `GO` — claim holds, evidence supports demand, feasible at this cost tier → name the first concrete step
2. `PIVOT` — the problem is real but this shape is wrong → state which assumption broke and the narrower/different shape that survives
3. `NO-GO` — claim fails, no demand evidence, or a hard blocker → state the blocking evidence and what would have to be true to revisit
4. Report the verdict with the top 2 reasons and the single weakest assumption; multiple ideas → one verdict each, then a ranking
5. Present via `/report-review`-style chat table; no files

### 5. Route The Next Step

> Goal: the verdict turns into work immediately

1. `GO` on a UI/CLI/TUI surface not designed yet → `/design-cli-prototype` / `/design-tui-prototype` (chat) or `/design-html-prototype` / `/design-web-prototype` (visual), then `/create-plan-in-dot-agents` → `/implement-to-production`
2. `GO` on a clear backend/docs/quality change → `/create-plan-in-dot-agents` directly
3. `PIVOT` → `/reframe` the claim, or `/idea-features` / `/idea-uxui` for the replacement shape; validate the new shape again before building
4. `NO-GO` → `/idea-merge` if the idea belongs inside an existing feature instead; otherwise stop and report
5. Several viable ideas competing for the same slot → `/prioritize` or `/pick-bestest`
6. Run `/suggest-next-action`

## Rules

### 1. Chat Only

- Never create files, `ideas.json`, or temp reports in this skill — persistence only on explicit request via `/create-report-to-dot-agents`
- One reply, one verdict per idea; keep the tables compact

### 2. Evidence Or Label It

- Every score needs a source (research, competitor comparison, real file/line in this repo, registry data); without one, write `assumption` — do not silently upgrade it
- The current codebase is evidence of feasibility, not of demand

### 3. Cost-Proportionate Rigor

- Small idea → `### 1` + a feasibility check is enough; do not run deep market research for a one-file change
- Product/new-repo idea → all of `### 2`, including competitor evidence, before any plan is written
- Never let the validation loop itself become the work: max 2 evidence rounds, then decide

### 4. Verdict Is Binding Until New Evidence

- State the verdict plainly; do not hedge into "maybe later" — `NO-GO` with revisit conditions is still `NO-GO`
- A hard blocker outranks the score average; never `GO` past one

- Use /ask-me if needed
- Use /report-review if needed
- Use /suggest-next-action if needed

## Expected Outcome

- The idea restated as a falsifiable claim with its assumptions labeled `known`/`assumption`
- A scored dimension table with evidence and sources per row
- One verdict per idea (`GO`/`PIVOT`/`NO-GO`) with the top reasons, the weakest assumption, and the exact next skill to run
