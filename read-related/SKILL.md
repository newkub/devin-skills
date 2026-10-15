---
name: read-related
description: Read and summarize related skills recursively
argument-hint: "[skill-name]"
related:
  - idea-use-skills-relations
  - review-devin-global-harness
  - report
  - suggest-next-action
  - deep-review-codebase
---

## Goal

Read and summarize the skills related to the current work recursively, to understand dependencies and avoid duplication

## Scope

Use before writing or editing a skill, to gather the needed context

## Execute

### 1. Read Related Skills

> Goal: read the related skills

1. Run `/review-devin-global-harness` to build the dependency graph and summarize skills

### 2. Synthesize And Report

> Goal: merge results and report

1. Collect guidelines and instructions from the skills read
2. Identify what is duplicated or conflicting
3. Run `/report` to format the output
4. Run `/suggest-next-action` to recommend the next step

## Rules

### 1. Orchestration Only

- Act as an orchestrator calling `/review-devin-global-harness` directly — do not redo the work
- Do not use `/deep-review-codebase` — it would duplicate the related-context reading
- Do not duplicate the content of `/review-devin-global-harness`

### 2. Output

- Show the dependency graph as a tree structure
- List the tasks that must be done in order
- Point out what is duplicated or conflicting

## Expected Outcome

- Dependency graph of the related skills
- Summary of the tasks and guidelines to follow
- Identified duplicates or conflicts between skills
- Recommended next action
