---
name: update-devin-harness
description: Keep global rules, global skills, and global subagents mutually aligned
argument-hint: "[scope]"
related:
  - update-devin
  - update-devin-global-skills
  - update-devin-global-rules
  - update-devin-global-subagents
  - list-devin
  - use-related-skills
  - deep-validate
  - check-reference
  - report
  - suggest-next-action
  - review-devin-global-harness
  - update-references
  - scan-codebase
---

## Goal

Keep `global_rules.md`, `devin global skills`, and `devin global subagents` precisely aligned, mutually consistent, and free of conflicts.

## Scope

Use when syncing all three layers of the devin ecosystem, especially after renames, merges, or bulk creation of skills/subagents — merged from the old `/align-devin-layers` (alias stub removed — use this skill directly).

## Execute

### Workflows

| Domain | Workflow |
|--------|----------|
| `devin-knowledge`, `knowledge` — check Devin knowledge notes/suggestions | `## Merged Details → devin-knowledge` |

### 1. Inventory All Layers

> Goal: gather information from every layer

1. Read `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
2. Run `/list-devin-global-skills`
3. Run `/list-devin-global-subagents`
4. Record versions, last updated, and critical rules

### 2. Run Update Workflows

> Goal: update each layer

1. Run `/update-devin-global-rules` to edit `global_rules.md` — that skill owns rule content; harness only decides that a rules change is needed and verifies the layers agree
2. Run `/update-devin-global-skills` to audit and update skills
3. Run `/update-devin-global-subagents` to update subagents
4. Record the output of each step

### 3. Detect Cross-Layer Misalignment

> Goal: find inconsistencies

1. Compare rules across global rules vs skills vs subagents
2. Run `/scan-codebase` to search for references across the repo
3. Check references: skill/subagent names in AGENTS.md, global rules, and skill `related`
4. Run `/review-devin-global-harness` to find broken references
5. Find circular dependencies or broken references
6. Identify skills/subagents that lag behind global rules

### 4. Resolve Conflicts

> Goal: resolve conflicts

1. If global rules and a skill conflict → adjust the skill or update global rules
2. If a subagent calls a skill that doesn't exist → update the subagent
3. If a skill references rules that don't exist → add or remove the reference
4. Use `/update-references` to sync across the repo
5. Use `/use-related-skills` to find overlaps

### 5. Validate Harness

> Goal: check completeness

1. Run `/deep-validate` against global rules
2. Check frontmatter of all skills with `/review-devin-global-harness`
3. Check subagents' `AGENT.md` with `/update-devin-global-subagents` if needed
4. Run `/check-reference`
5. Run `git diff --check`

### 6. Report

> Goal: summarize alignment status

1. Run `/report` with columns: `No.`, `Layer`, `Status`, `Changes`, `Issues`
2. Identify anything still outstanding
3. Run `/suggest-next-action`

## Rules

### 1. Run In Order

- Update global rules before skills before subagents
- If there's a dependency loop → resolve the loop first
- Never skip a layer

### 2. Minimal Scope

- Change only what conflicts or lags behind
- Don't change large structures unless necessary
- Preserve each layer's original intent

### 3. Cross-Reference Integrity

- `name` in frontmatter must match the directory
- `related` must actually exist
- `AGENTS.md` must be in sync

### 4. Backup

- Back up `global_rules.md` before editing
- Back up `AGENTS.md` if there are large changes
- Use `git commit` one layer at a time

- Use /update-devin-global-subagents if needed

## Merged Details

### devin-knowledge

##### Goal

Check that Devin knowledge notes are still correct and in use — find stale notes, conflicting notes, unused notes, or notes referencing resources that no longer exist.

##### Scope

- Use `devin_knowledge_manage` MCP tools when available — or knowledge files stored in the repo/workspace
- Covers: note freshness (age vs referenced reality), contradictions between notes, dead references, coverage gaps
- Read-only: report only — edit/delete via user confirmation

##### Execute

###### 1. Inventory Knowledge

> Goal: gather all notes

1. Use `devin_knowledge_manage` (list) or search existing knowledge files
2. Record metadata: title, content summary, created/updated date, folder
3. Group by topic/folder

###### 2. Check Freshness

> Goal: find possibly stale notes

1. flag notes that are old (>90 days) without an update — especially those citing tools/versions
2. compare notes that cite code/config against current state — have the facts changed?
3. flag notes that reference skills/files that were deleted or renamed (use `/check-reference` together)

###### 3. Detect Contradictions And Duplicates

> Goal: find conflicting or duplicate notes

1. compare notes on the same topic — conflicting advice (e.g. different configs)
2. find near-duplicates — notes covering the same thing should be merged
3. flag suggestions left unreviewed for a long time

###### 4. Report

> Goal: summarize knowledge health

1. Use `/report`: `No.`, `Note`, `Issue`, `Age`, `Severity`, `Action`
2. Actions: `update`, `merge`, `dismiss`, `delete`, `keep`
3. Summarize coverage: topics with complete notes vs missing

##### Rules

###### 1. Evidence-Based

- "stale" needs a reason — age alone isn't enough, compare against current reality
- a contradiction must cite both notes with the exact point of conflict

###### 2. Read-Only

- Don't edit or delete notes — report so the user decides
- Editing knowledge requires user confirmation

###### 3. Value Preserved

- an old but still-correct note ≠ stale — flag only what is wrong or unused
- be careful with institutional knowledge — suggest archive over delete

##### Expected Outcome

- a report of stale/contradicting/duplicate notes with evidence
- action recommendations per note
- an overview of knowledge coverage

## Expected Outcome

- global rules, global skills, global subagents are aligned
- no broken references
- no duplicated or conflicting rules
- an alignment status report exists
- passes validation

