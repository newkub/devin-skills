---
name: reframe
description: Assess whether content/plan is written from a suitable angle, or should be reframed to another angle
argument-hint: "[target]"
related:
  - deep-thinking
  - deep-validate
  - deep-research
  - rethink
  - idea
  - ask-me
  - report
  - suggest-next-action
---

## Goal

Check whether the content, plan, idea, or skill currently being written is in the `appropriate frame` — audience, verb/lifecycle prefix, level of abstraction, mental model — or should be reframed to another angle before commit

## Scope

Used when writing or designing new content (skill, doc, plan, prompt, idea) and you want to challenge the framing before delivering — not a correctness check (use `/check-reference`) or a freshness check (use `/deep-review-codebase`)

## Execute

### 1. Identify Current Frame

> Goal: Understand the angle the content is currently written from

1. Identify the target (skill, doc, plan, idea) and read the content
2. Identify the current frame:
   - `Audience`: who it is written for (user, model, future-self, reviewer)
   - `Lens`: which angle it is written from (tool-centric, task-centric, outcome-centric, lifecycle)
   - `Level`: which level of abstraction (how-to steps, concepts, decision guide)
   - `Boundary`: what the scope covers / what it cuts out
3. Record the assumptions that the frame relies on

### 2. Generate Alternative Frames

> Goal: Think of other possible angles

1. Run `/deep-thinking` to generate alternative frames such as:
   - tool-centric → task-centric (change from "how to use X" to "do Y with X")
   - single-skill → dispatcher + domain skills
   - imperative steps → decision table / checklist
   - feature lens → user-outcome lens
   - happy path → failure-first framing
2. For each frame: identify pros, cons, who benefits, and the work that needs rework

### 3. Research Precedents

> Goal: Compare against conventions and real-world framing

1. Run `/deep-research` on the domain's official docs/community — how do they frame this topic
2. Compare against other skills/docs in the repo with a close domain — frame consistency
3. If it is a skill → compare against prefix conventions (`check-*`, `run-*`, `follow-*`, `idea-*`) to see whether the frame actually matches the lifecycle

### 4. Evaluate And Decide

> Goal: Choose the most appropriate frame

1. Run `/deep-validate` to evaluate each frame against criteria:
   - Does it truly match the user's intent
   - Does the audience understand/act faster
   - Is it maintainable and consistent with the system
   - Is the rework cost worth it
2. Decide: `keep` (current frame is already suitable), `reframe` (change the angle), or `split` (separate the content into 2+ frames)
3. If the decision is risky/ambiguous → run `/ask-me` to let the user choose

### 5. Report

> Goal: Summarize results with reasoning

1. Run `/report` table: No, Frame, Lens, Pros, Cons, Verdict
2. If verdict = reframe/split → specify the new frame + the outline it should have + skills that must be changed (`/rewrite`, `/refactor`, `/update-*`)
3. If verdict = keep → give a brief reason that the current frame is the best
4. Run `/suggest-next-action`

## Rules

### 1. Reframe Discipline

- Always challenge the frame — do not default to "keep" if you have not actually generated alternatives
- Reframe only when the outcome changes significantly — do not reframe for aesthetics
- If the content has multiple audiences → consider split before reframe

### 2. Evidence

- Choose a frame from evidence (usage patterns, precedents, audience need) not taste
- Specify the assumptions each frame relies on — if an assumption changes, the verdict may change

### 3. Boundaries

- reframe assesses and recommends — it does not rewrite itself (rewrite via `/rewrite` or `update-*`)
- Use before finalizing new content, or when you suspect the document is "written from the wrong angle"
- Do not use for trivial content — the cost of analysis must be less than the risk of the wrong frame

- Use /deep-thinking if necessary
- Use /deep-validate if necessary
- Use /deep-research if necessary
- Use /rethink if necessary
- Use /suggest-next-action if necessary

## Expected Outcome

- Know whether the current frame is appropriate or should change, with alternatives compared
- Clear verdict: keep / reframe / split with reasoning and rework scope
- If reframe → an outline of the new angle is ready to act on via the appropriate skill
