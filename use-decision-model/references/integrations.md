# Caller integrations

One skill owns the mechanism (`/use-decision-model`); a caller only supplies the state, the questions or preset, and its threshold. Every row below is wired in the caller's own `SKILL.md`.

| No. | Skill | Hook | Question type | Threshold / guard |
|---|---|---|---|---|
| 1 | `/ask-me` | `### 2. Prepare Multi-Step Questions` | `choice` over the option labels | recommend the top option only at `confidence ≥ 0.6`; below that, no recommendation |
| 2 | `/pick-bestest` | `### 1. Prepare Options` | `choice` over the option list | mark `(recommended)` only at `confidence ≥ 0.6` |
| 3 | `/prioritize` | `### 3. Calculate Priority` | `score` for impact and effort, `noul` for urgency | advisory pre-score only; the impact/effort matrix stays the authority |
| 4 | `/validate-idea` | `### 4. Give One Verdict` | `choice` over `GO`/`PIVOT`/`NO-GO`, `noul` for hard blockers | never overrides a hard blocker or missing evidence; a low-confidence pre-signal is not a verdict |
| 5 | `/follow-enter-dot` | `### 2. Determine Next Action` | `choice` over the candidate actions | only when two or more rules match or the state is mixed; the ordered rules win otherwise |
| 6 | `/suggest-next-action` | `### 5. Evaluate Priority` | `choice` over the candidate actions | ordering hint; repo evidence still decides |
| 7 | `/apply` (`Mode: Choose`) | `### Mode: Choose` step 3 | `choice` over the options | `✅` recommendation only at `confidence ≥ 0.6` |

## What each caller must pass

| Caller | State | Questions |
|---|---|---|
| `/ask-me` | the question plus each option's `label` and `description` | one `choice` whose criteria are the options |
| `/pick-bestest` | same as `/ask-me` | same as `/ask-me` |
| `/prioritize` | one task: title, why it matters, what it touches | `impact` and `effort` as `score`; `urgency` as `noul` |
| `/validate-idea` | the falsifiable claim plus its evidence list | verdict `choice`; one `noul` per hard-blocker class |
| `/follow-enter-dot` | the state signals that matched (todos, git status, validation result) | one `choice` whose criteria are the candidate actions |
| `/suggest-next-action` | the same evidence `/suggest-next-action` collected in `### 1` | one `choice` over the actions it will present |
| `/apply` | the option table with pros/cons/score | one `choice` over the options |

## Guardrails shared by every caller

- The caller must degrade cleanly: no ollaya runtime, no model, low confidence, or an error all fall back to the caller's existing deterministic behavior. A decision model is an accelerator, never a prerequisite.
- A decision model never replaces a user confirmation, a hard blocker, a measured metric, or a repo-evidence finding. It can only order, pre-select, or pre-screen.
- The caller reports the model and the probability next to the recommendation so the user can audit it.
- The caller keeps one hook. Do not add a second decision-model call for the same question.

## Adding a new caller

1. Confirm the caller's decision is closed-answer (`choice` / `score` / `noul`) — otherwise do not add it.
2. Add one numbered row to the first table and one row to the second table in the same change as the caller's edit.
3. Add `/use-decision-model` to the caller's `related` list.
4. Validate: `/check-skills-structure` and `/check-agents-lint` on both packages.
