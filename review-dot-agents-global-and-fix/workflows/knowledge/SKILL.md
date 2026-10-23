---
name: review-dot-agents-global-and-fix-knowledge
description: Check knowledge notes for stale, conflicting, or unused content
related:
  - review-dot-agents-global-and-fix
  - check-reference
  - report

---

## Goal

Check that knowledge notes are still correct and in use — find stale, conflicting, duplicate, or dead-reference notes

## Scope

- Source: the `devin_knowledge_manage` MCP tools when available, otherwise knowledge files in the repo or workspace
- Covers freshness, contradictions, dead references, and coverage gaps
- Read-only — edits and deletes need user confirmation

## Execute

### 1. Inventory

> Goal: gather all notes

1. Use `devin_knowledge_manage` list, or search the knowledge files
2. Record title, summary, created date, updated date, and folder
3. Group by topic

### 2. Check Freshness

> Goal: find possibly stale notes

1. Flag notes older than 90 days that cite tools or versions without a later update
2. Compare notes that cite code or config against the current state
3. Flag notes referencing skills or files that were deleted or renamed; pair with `/check-reference`

### 3. Detect Contradictions And Duplicates

> Goal: find conflicting or repeated notes

1. Compare notes on the same topic for conflicting advice
2. Find near-duplicates that should merge
3. Flag suggestions left unreviewed for a long time

### 4. Report

> Goal: summarize knowledge health

1. `/report` table columns: No., Note, Issue, Age, Severity, Action
2. Actions: `update`, `merge`, `dismiss`, `delete`, `keep`
3. Summarize coverage: topics with complete notes versus missing

## Rules

- Stale needs a reason — age alone is not enough
- A contradiction must cite both notes and the exact point of conflict
- Never edit or delete a note in this workflow; report so the user decides
- Prefer archive over delete for institutional knowledge
- Never use `**` bold

## Expected Outcome

- A numbered report of stale, conflicting, and duplicate notes with evidence
- One recommended action per note
- A coverage summary by topic
