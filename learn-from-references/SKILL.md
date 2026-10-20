---
name: learn-from-references
description: Learn from user-given references — files, repos, docs, skills — extract patterns and apply them
argument-hint: "<@files|urls|repo|skill-name...>"
related:
  - learn-from-web
  - learn-from-cli
  - learn-from-codebase
  - check-reference
  - deep-research
  - report
---

## Goal

Read and extract knowledge from references the user points to directly — several sources mixed together (local files, GitHub repos, docs, skills) — then summarize it into patterns, conventions, or knowledge that can be applied to the current task immediately

## Scope

- Use when the user gives a pointed reference (`@file`, URL, repo, skill name) — if it is web docs only → `/learn-from-web`; a purely local codebase → `/learn-from-codebase`; a CLI binary → `/learn-from-cli`
- Covers: reference implementations, example repos, API docs, skill `references/` dirs, design/pattern docs
- Output: summarize patterns + conventions in chat, write `references/` for a skill, or apply them into the work — **do not copy code directly** without understanding it
- Verify the correctness of claims from references → `/check-reference`; cross-check multiple sources/high risk → `/deep-research`

## Execute

### 1. Gather References

> Goal: Know which sources there are and how to read them

1. `@file` / path → `read` directly; directory → list + read the main files first (README, index, entry points)
2. GitHub repo → `/learn-from-web` via DeepWiki (`read_wiki_structure` → `read_wiki_contents` → `ask_wiki_question`)
3. URL/docs → `webfetch` or `crw_scrape`; library API → `context7` (`resolve` → `query-docs`)
4. skill name → read `SKILL.md` + `references/` in `%APPDATA%\devin\skills\<name>/`
5. Group them: primary (the source of truth to follow) vs supporting (supplementary context)

### 2. Read With Purpose

> Goal: Extract only what the task needs

1. Define the question before reading: what does the task need from this reference — API surface? patterns? conventions? pitfalls?
2. Read in order: overview → core patterns → examples closest to the task → edge cases
3. Skip: boilerplate, generated files, irrelevant tests, marketing content

### 3. Extract Knowledge

> Goal: Get patterns that can be applied, not just a summary

1. For each reference note down: **patterns** (how it is done), **conventions** (rules to follow), **constraints** (prohibitions/limits), **gotchas** (frequent failure points)
2. Compare against the current codebase — differing conventions must be explicitly called out as to whether to adopt them or not
3. If you find a conflict between references → `/check-reference` or choose according to the official source

### 4. Apply Or Persist

> Goal: Knowledge does not get lost and is actually applied

1. If the task is to implement → apply the patterns into the work according to the current project's conventions (references are a guide, not the original)
2. If it is reusable knowledge → write it into the `references/` of the relevant skill, or `AGENTS.md` if it is a project convention
3. If the user asks for a summary → produce a structured report: each source + what was extracted + how it will be used

### 5. Report

> Goal: The user knows what was learned

1. Run `/report` to summarize: references read, main patterns/conventions, what was applied or persisted
2. Point out gaps — references that could not be read, or missing information

## Rules

- Read the actual reference before summarizing — never guess from the file name/URL
- The primary source is the original official docs/code — blog/forum are supporting only
- Always apply according to the destination project's conventions — references do not override project rules
- If multiple references conflict → ask the user or choose according to authority (official > community)
- Do not modify the reference sources — read only

## Expected Outcome

- Clear patterns/conventions obtained from every reference the user provided
- Knowledge applied into the work or persisted in the right place
- A report stating clearly what was read, what was obtained, and how it is used next
