---
name: reflex-to-improve-dot-agents-global
description: End-of-task reflex - improve every dot-agents layer from evidence
argument-hint: "[task|session|diff]"
related:
  - add-to-global-skills
  - update-agents-skills-global
  - update-devin-global-subagents
  - update-dot-agents-project
  - update-agents-md
  - review-dot-agents-global-and-fix
  - idea-agent-skills
  - check-agents-session
  - use-related-skills
  - follow-principles
  - report
  - ask-me
---

## Goal

At the end of a task, decide from evidence which dot-agents layer — skill, global rule, subagent, hook, MCP server, or project scaffold — would stop the same work from being rediscovered, then hand each confirmed item to the skill that owns that layer — never writing any asset here

## Scope

Runs once per finished task, or when the user asks what is worth improving. Covers every layer of the global harness: skills, global rules, subagents, hooks, MCP servers, and project scaffolds. Not this skill when a skill artifact is already chosen and only needs promoting — use `/add-to-global-skills`; when the user wants free-form proposals — use `/idea-agent-skills`; when an existing asset must change now — route through the owner skill named in `### 3`; when the whole harness needs an audit — use `/review-dot-agents-global-and-fix`

| Argument | Evidence source | First move |
|----------|-----------------|------------|
| `task` or none | the task that just finished | `### 1` with the current session |
| `session` | a past or other session | `/check-agents-session` |
| `diff` | uncommitted or committed changes | read the diff before judging |

## Execute

### 1. Collect The Evidence

> Goal: judge from what actually happened, not from memory

1. Take the finished task, session, or diff named by the argument; `/check-agents-session` when the evidence is outside the current session
2. Collect only hard signals: decisions that changed the plan, commands that failed then worked, corrections the user repeated, sources that resolved ambiguity, versions or APIs verified live
3. Skip the whole reflex when the task produced no new decision, command, or correction — an empty result is a valid outcome

### 2. Apply The Capture Signals

> Goal: a stable, repeatable test for "worth capturing"

| No. | Signal | Example | Verdict |
|-----|--------|---------|---------|
| 1 | Same correction given twice | user re-explains the same ordering rule | rule or existing skill |
| 2 | Repeatable sequence with a decision point | a multi-step release or migration path | skill workflow, or a hook when it must run automatically |
| 3 | Tool or API used beyond its docs | a flag or hook found by experiment | skill reference or global rule |
| 4 | One-off value or local state | ids, ports, credentials, ticket numbers | never capture |
| 5 | Knowledge already in a dot-agents asset | a rule that lives in another skill | extend that asset |

### 3. Classify By Layer

> Goal: every candidate names the smallest layer that fixes it and the skill that owns that layer

| No. | Layer | Evidence that it belongs here | Owner |
|-----|-------|-------------------------------|-------|
| 1 | New skill package | a recurring decision or workflow no skill covers | `/add-to-global-skills` |
| 2 | Existing skill | the skill exists but lacks the rule, reference, or workflow | `/update-agents-skills-global` |
| 3 | Global rule | the guidance must apply to every task, not one skill | `/review-dot-agents-global-and-fix` (`update` domain) then `/update-agents-md` for the rules file |
| 4 | Subagent | the work needs a separate context or role | `/update-devin-global-subagents` |
| 5 | Hook | the step must run automatically on a tool or session event | the harness `hook-config` guide, then re-check the layer |
| 6 | MCP server | a tool or data source should be reachable from every session | the harness `mcp-config` guide, then re-check the layer |
| 7 | Project scaffold | the knowledge is project-specific (`.agents/`, project `AGENTS.md`) | `/update-dot-agents-project` or `/update-agents-md` |

### 4. Filter Against Existing Assets

> Goal: no candidate that already exists

1. Run `/use-related-skills` and search the repo for the same rule, command, tool name, agent, hook, or MCP entry
2. Covered already → the candidate becomes an edit route through its owner skill in `### 3`, not a new asset
3. Uncovered → keep it and note the closest existing package, agent, or rule file

### 5. Score And Rank

> Goal: the user sees why one item matters more than another

1. Score each candidate on recurrence, cost of rediscovery, portability, and conflict risk with existing assets
2. Rank with `/follow-principles` and drop anything below the bar together with the reason it failed
3. Keep at most three candidates; more means the filter is too loose

### 6. Present Candidates

> Goal: one decision per row, no hidden writes

1. Present with `/report`: No. / Candidate / Layer / Evidence / Owner / Impact / Action
2. Ask with `/ask-me` (multi-select) whether to capture, extend, or skip each row; never write on your own
3. Zero candidates → say so plainly and stop

### 7. Hand Off

> Goal: the confirmed items actually land in the right layer

1. Route each confirmed row to its owner from `### 3`, one candidate at a time
2. Idea that still needs shaping before any asset exists → `/idea-agent-skills`
3. Hooks and MCP entries have no repo package of their own — hand them to the harness guides named in `### 3` and record the resulting file path in the report

### 8. Confirm Landing

> Goal: the reflex closes with proof, not intent

1. After each owner skill finishes, confirm `related`, references, and the skills `AGENTS.md` counts and family list were synced downstream
2. Report per `/report`: candidate, target layer, file touched, and anything the owner skill deliberately rejected
3. Nothing landed → report the skipped rows with their reason

## Rules

1. Reflex Not Bulk — at most three candidates per task; more means the filter is too loose
2. Evidence Only — every candidate cites a file and line, a command, or a source URL; no candidate from intuition alone
3. No Silent Writes — this skill never creates or edits a skill, rule, subagent, hook, MCP entry, or scaffold; selection always routes to the owner skill
4. Consent First — work stops at the `/ask-me` until the user selects rows
5. Zero Is Fine — reporting "nothing worth improving" is a correct, complete result
6. Smallest Layer Wins — pick the narrowest layer that prevents rediscovery (project scaffold before global rule, rule before new skill) and extend before creating

## Expected Outcome

- A ranked candidate table with evidence, a layer, and an owner skill per row, or an explicit "nothing worth improving" statement
- Confirmed rows land through the owning skill for their layer; nothing is written while the reflex itself runs
- Duplicates are redirected to the owner skill for an edit instead of creating a second asset for the same knowledge
