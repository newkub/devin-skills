---
name: idea-use-skills-relations
description: Generate skill relation ideas — points where use-related-skills should be used and missing edges
argument-hint: "[skill-name|family|all]"
related:
  - use-related-skills
  - read-related
  - idea-new-devin-global-skills
  - update-devin-global-skills
  - update-devin-harness
  - list-devin-global-skills
  - create-plan-in-dot-devin
  - report
---

## Goal

Generate ideas and a draft for improving skill relations — analyze the whole `related` graph, find missing edges, points where `use-related-skills` should be invoked, and new relation structures that should exist (don't actually implement until the user confirms → `/follow-your-suggestion`)

## Scope

Use when you want to check and expand the relations between devin global skills:

- skills that are written/edited but have no `related` yet, or whose `related` doesn't match completely
- skills whose workflow should end with `/use-related-skills` but doesn't invoke it (e.g. `create-*`, `update-*`, `new-*` skills)
- relations lacking symmetry — A references B but B doesn't reference A back
- ideas for a new relation-type skill (`use-*`, `follow-*`) that don't exist yet

## Execute

### 1. Select Scope

> Goal: Define the scope of skills to analyze

1. If the argument specifies a skill/family → use it directly; if `all` or unspecified → survey the whole global skills directory
2. Run `/list-devin-global-skills` to get the full list of skills with `name`, `description`
3. Read the `SKILL.md` frontmatter + `Execute` of each skill in scope
4. If scope > 10 skills → run `/create-plan-in-dot-devin` instead of analyzing in a single round

### 2. Build Relations Graph

> Goal: Have a map of existing relations before proposing ideas

1. Combine the `related` of all skills into directed edges `A -> B`
2. Combine explicit invocations in the body (`run /skill-name`, `use /skill-name`) as another kind of edge
3. Find edges pointing to a skill that doesn't actually exist → broken references
4. Find asymmetric pairs — `A.related` has B but `B.related` doesn't have A — then decide whether they should be symmetric or intentional (not every pair needs to be two-way)

### 3. Identify Relation Gaps

> Goal: Find points where relations should exist but are missing

1. Skills whose `Execute` invokes `/skill-name` but doesn't list it in `related` → add an edge to `related`
2. `create-*`, `update-*`, `new-*` type skills that touch `SKILL.md` or `global_rules.md` but don't end with `/use-related-skills` → propose adding a step
3. Skills whose Goal/Scope overlaps but that aren't linked (e.g. `idea-*` and `review-*` in the same domain) → propose complementary edges
4. Skills that are frequently invoked but that nobody links back to → propose reverse edges
5. Compare with the results of `/search-skills` — skills that search recommends together but `related` doesn't reflect

### 4. Draft Relation Ideas

> Goal: Write a draft per idea without editing files yet

1. Per idea, specify:
   - `type`: `add-related-edge`, `add-invocation-step`, `new-skill`, `remove-broken-ref`
   - `source skill`, `target skill`, the rationale, and the relation kind (`direct dependency`, `complementary`, `follow-up`, `alternative`)
   - a draft diff of the frontmatter/Execute step to change (not applied until confirmed)
2. For `new-skill` ideas → specify the name in the form `<verb>-<domain>` and draft `name`/`description`/`related` — implementation lives in `/idea-new-devin-global-skills` + `/update-devin-global-skills`
3. Run `/report` table: `No.`, `Type`, `Source`, `Target`, `Kind`, `Rationale`, `Priority` — continuous numbering, no reset between runs

### 5. Validate And Handoff

> Goal: Check the draft and hand off to the skill that actually implements

1. Check that every target skill actually exists, doesn't duplicate the existing `related`, and isn't a self-reference
2. Rank by impact: broken refs > missing invocation steps > missing edges > new-skill ideas
3. If the user confirms → run `/follow-your-suggestion` then apply via `/use-related-skills` (the Update Related Skills step) or `/update-devin-global-skills` — this skill is idea/draft only
4. If the draft touches `global_rules.md` → specify that applying must go through `/update-devin-harness`
5. If there are no gaps → report that the graph is already complete and run `/suggest-next-action`

## Rules

### 1. Draft Only

- Never edit `SKILL.md`, `related`, or `global_rules.md` in this skill — only produce a draft, then hand off to `/use-related-skills`, `/update-devin-global-skills`, or `/update-devin-harness`
- Every idea must cite evidence from real files (frontmatter, Execute steps) — never guess from the name alone
- Proposed `related` edges must make sense both ways (`Goal`/`Scope`/`Execute` genuinely related) — not just linking everything together

### 2. Relation Quality

- Don't force symmetry — propose a reverse edge only when the target should know that a source invokes it
- Limit `related` to ≤ 10 entries per skill — if it exceeds this, propose only the most relevant and explain what should be dropped
- When proposing an invocation step, write it per `update-devin-global-skills` (`## Conventions → Invoke Skills`)
- Continuous numbering continuing from the previous idea report if any — don't delete old ideas

## Expected Outcome

- The relations graph of skills in scope with the broken/asymmetric edges found
- An ideas table: edges to add, points where `/use-related-skills` should be invoked, new skill ideas
- Priority + rationale per idea with a draft diff that can be applied immediately after confirmation
- A clear handoff path (`/follow-your-suggestion` → `/use-related-skills` or `/update-devin-global-skills`)
