---
name: add-to-global-skills
description: Promote an existing artifact into a global skill package, verified
argument-hint: "[path|tool|session|skill]"
related:
  - reflex-to-improve-dot-agents-global
  - new-skills
  - update-agents-skills-global
  - idea-agent-skills
  - check-agents-session
  - check-my-global-cli
  - use-related-skills
  - scan-codebase
  - review-dot-agents-global-and-fix
  - deep-validate
  - check-skills-structure
  - update-references
---

## Goal

Turn an artifact that already exists — a project skill, an installed CLI, a finished session, a repeated workflow, a reference doc — into a global skill package under `D:/dot-agents/skills` (`%APPDATA%\devin\skills`) without duplicating an existing skill

## Scope

Artifact exists and must be promoted. Not this skill when there is only an idea and no artifact — use `/new-skills`; when an existing global skill needs a content or structure change — use `/update-agents-skills-global`; when the question is whether anything is worth improving in any dot-agents layer — use `/reflex-to-improve-dot-agents-global`; when the user wants proposals before any artifact exists — use `/idea-agent-skills`

| Argument | Source | First move |
|----------|--------|------------|
| path to `.agents/skills/<name>` | project-local skill | read it in full, then `### 2` |
| `tool:<cli>` | installed CLI tool | `/check-my-global-cli` then read the binary help |
| `session` | a finished session | `/check-agents-session` to extract the evidence |
| `skill:<name>` | existing global skill | route to `/update-agents-skills-global` |
| none | infer from context | ambiguous → `/ask-me` |

## Execute

### 1. Identify The Artifact

> Goal: know exactly what is being promoted and where it lives

1. Resolve the argument to a real path, tool, or session; a missing artifact → stop and report, never reconstruct it from memory
2. Read the whole artifact, not excerpts; record the source path or URL, its version or date, and its license
3. Classify it as skill package, tool, workflow, reference, or config recipe, and name the trigger that makes someone invoke it

### 2. Decide Global Worthiness

> Goal: only portable, reusable knowledge becomes global

1. Promote when the knowledge recurs across projects, encodes a decision rule, or wraps a tool used often
2. Keep it project-local when it names project paths, ticket ids, secrets, or a one-off runtime state — report that verdict instead of adding
3. Strip machine-specific values; anything that only works on this machine is evidence, not content

### 3. Dedupe And Place

> Goal: the right package, prefix, and section

1. Run `/scan-codebase` and `/use-related-skills` for near-duplicates; a near-duplicate → extend that skill via `/update-agents-skills-global`
2. Pick the prefix from the contract in `new-skills` `## Rules` `### 4`; when no prefix fits, use the default `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome` shape
3. When the artifact is a sub-case of an existing skill, add `workflows/<case>/SKILL.md` inside that package instead of a new top-level skill

### 4. Research Before Writing

> Goal: no stale fact enters the repo

1. Verify every command, flag, API, and version against official docs or the live binary — the artifact may already be out of date
2. Record the researched version next to the instruction that depends on it, plus the source URL
3. Unverifiable claim → drop it or flag it explicitly, never publish it as fact

### 5. Write The Package

> Goal: source-faithful content in the repo standard

1. Write `SKILL.md` with the required sections, English content, `No.`-first tables, no `**` bold
2. Move long material to `references/`; library and tool artifacts also get `best-practices/` and `usecases/`
3. Credit the source in one line (path or URL) and remove project-specific names, secrets, and local absolute paths

### 6. Wire And Sync

> Goal: the new skill is discoverable and referenced

1. Add `related` entries (maximum 15) and mention each one in the body; use `/use-related-skills` to find the real integration points
2. Wire inbound references only where a caller genuinely hands off, and record the skipped candidates with the reason
3. Run `/update-references`, then sync the skills `AGENTS.md` counts and family list in the same change

### 7. Validate

> Goal: it passes every gate before it ships

1. Run `/check-skills-structure` with `--anchors --tables --findings`
2. Run `/review-dot-agents-global-and-fix` and `/deep-validate`
3. Failure → fix and re-run the gate (maximum 3 rounds), then stop and report the remaining findings

### 8. Report

> Goal: the user sees what moved and what did not

1. Report per `/report`: artifact → destination, files added, wiring, exclusions with reasons
2. Commit or push only when the user asks

## Rules

1. Artifact First — every sentence traces to the artifact or an official source; never invent API surface or examples
2. No Duplicates — merge into an existing skill before creating a package; `new-skills` owns creation from an idea, this skill owns promotion of an artifact
3. Standard Conventions — required sections, English content, ≤250 lines per file, `related` ≤15 with a body mention, no `**` bold
4. Portability — project names, ticket ids, credentials, and machine-only paths are stripped or reported, never promoted
5. Safety — overwriting an existing `SKILL.md` needs explicit confirmation; list target files before writing

## Expected Outcome

- The artifact lives as a global skill package (or as a `workflows/` entry of an existing package) that passes `/check-skills-structure` and `/deep-validate`
- Every command and version is verified against official docs or the live tool, with the source recorded
- `related` is complete and mentioned in the body; skills `AGENTS.md` counts and family list match the repo
- The report states what was promoted, what was merged instead, and what was deliberately kept local
