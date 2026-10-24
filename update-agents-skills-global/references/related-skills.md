# Related Skills

> Two-direction relation analysis for a skill. Cited as `update-agents-skills-global` `## Conventions → Related Skills` — keep the section name stable.

Two questions, always asked together:

- Inbound — which existing skills should this skill pull in to do its work (compose/extend)
- Outbound — which other skills should invoke this one, and at which step (reverse link)

`related` in frontmatter is the durable result; this section is how it gets decided. Contract and limits live in `## Conventions → Invoke Skills`.

## Inbound

> Which skills this one composes.

1. Read the target's `name`, `description`, `Goal`, `Scope`, `## Execute`, `## Rules`; note its existing `related`
2. Get candidates: `/list-dot-agents-global` for the full catalogue, `/search-skills` for a task→skill match, `/scan-codebase` for overlap; a family or >10 candidates → `/create-plan-in-dot-agents`
3. Rank each candidate by relation kind:
   - `direct dependency` — its output is this skill's input
   - `complementary` — same goal, different dimension (e.g. `check-*` vs `review-*`)
   - `follow-up` — runs after this skill to finish the job
   - `alternative` — same job, better fit under a condition; state the condition
4. Verify the candidate's directory exists, its `Goal`/`Scope` genuinely intersect, and it is not already in `related` and not the skill itself
5. Turn the top matches into invocations per `## Conventions → Invoke Skills` — `run /x to <reason>`, or partial invocation naming the sections when used as a gate

## Outbound

> Which skills should invoke this one.

1. For each `## Execute` step, ask: does another skill have a step that this skill already answers? (e.g. any `create-*`/`update-*`/`new-*` step that writes a `SKILL.md`, `related`, or `global_rules.md`)
2. Prefer a step inside an existing skill over a new skill — propose the smallest insertion that makes the caller complete
3. Propose a reverse edge only when the caller should know this skill exists at that step; a one-way mention is correct when the caller just points at the spec (`see also: /x`)
4. For a skill whose workflow should end by checking integrations, propose the closing step: `run /update-agents-skills-global (## Conventions → Related Skills) to <reason>`
5. A skill that touches `global_rules.md` or root `AGENTS.md` → its reverse step must route through `/review-dot-agents-global-and-fix`

## Ad Hoc

> Pick one skill to continue the current task, when there is no skill being edited.

1. State the current goal and what is missing (fix, check, create, research, deploy) — unclear → `/ask-me`
2. Get candidates: `/suggest-next-action` for a task, `/list-dot-agents-global` or `/search-skills` for browsing; narrow to 1–3
3. Compare on `Goal`/`Scope`/constraints, then pick one; several genuinely independent → `/use-subagents` instead of a chain
4. Invoke with full context (paths, args, evidence, expected output), then check the result — misses the goal → return to step 2

## Update Related

> Persist the decision.

1. Write the accepted edges into `related` — ≤15 entries, every entry has a real dir and is mentioned in the body, no self-reference, no duplicates; at the cap → drop the weakest edge instead of exceeding it
2. Apply the reverse edge in the other skill only when step `## Outbound` matched a real step
3. Run `/update-references` (both directions), then `/check-reference` to confirm each target's paths and claims
4. A proposed edge that would need a new skill → hand off to `/idea-agent-skills` (idea only) instead of inventing the skill here

## Output

Present one table, most relevant first; keep numbering continuous with any earlier table in the session.

| No. | Skill | Direction | Kind | Reason | Action |
|-----|-------|-----------|------|--------|--------|
| 1 | `skill-name` | inbound / outbound | direct dependency / complementary / follow-up / alternative | one line, cited from `Goal`/`Scope`/`Execute` | add edge / add step / see also / new-skill idea |

Below the table, add the invocation line to paste (`run /x to <reason>`) per edge accepted, and list rejected candidates with the reason in one line each.

## Rules

1. Evidence Only — every edge cites a real line from the target's `Goal`/`Scope`/`Execute`; a name similarity is not evidence; never guess a skill that does not exist
2. Both Directions — an inbound edge alone is incomplete: state explicitly whether a reverse edge is needed and why not when it is not
3. No Bloat — `related` ≤15, and only genuinely usable pairs; unrelated families stay unlinked even if both are useful
4. Draft Before Write — propose the table first; apply to `related`/`SKILL.md` only after confirmation, then run `/update-references` + `/check-reference`
5. One Owner — the `related` contract and cap are owned by `## Conventions → Invoke Skills`; a conflicting local rule found in another skill → fix at the owning skill per `SKILL.md` `### 9` item 7, never keep both
