---
name: search-similar
description: Find skills, code, or patterns similar to the specified target
argument-hint: "[scope]"
related:
  - search
  - use-astgrep
  - list-devin
  - use-related-skills
  - create-similar
  - ask-me
  - report
---

## Goal

Search for skills, code patterns, files, or functions similar to a given target, for reuse, avoiding duplication, or building something new on the existing basis

## Scope

Use when looking for similar existing examples before creating a new skill or before refactoring

See also: /use-astgrep

## Execute

### 1. Define Target

> Goal: identify what you want to find similars of

1. If the user gives a skill name → read that skill
2. If the user gives a code snippet → record the snippet
3. If the user gives a pattern or responsibility → distill it into keywords
4. If unclear → run `/ask-me`

### 2. Search By Name And Prefix

> Goal: find similars via name matching

1. Run `/list-devin-global-skills` to view the skill list
2. Find skills whose prefix or name resembles the target
3. Find skills with matching keywords in `description` or `name`
4. Record candidates with score > 0

### 3. Search By Content

> Goal: find similars by content

1. Run `/search-files-patterns` with keywords from the target
2. Run `/use-astgrep` for code patterns (if it is code)
3. Search relevant categories in `AGENTS.md`
4. Search `related` frontmatter that references the target

### 4. Compare Similarity

> Goal: rank the candidates

1. Compare the goal against each candidate in terms of:
   - responsibility / goal
   - commands/tools used
   - structure / sections
   - target domain
2. Give a score of 0-100 to each candidate
3. State why each is similar

### 5. Report

> Goal: summarize the search results

1. Use `/report` with columns: No, Name, Type, SimilarityScore, Why
2. Sort by SimilarityScore from high to low
3. Highlight the top 5 most similar
4. Recommend a next action: reuse, extend, or `/create-similar`

## Rules

- Do not create a duplicate when a skill already covers it
- Compare by responsibility, not by name alone
- If no similar is found → report not found and recommend `/create-similar`
- Do not expose secrets or sensitive data in snippets
- If the context is unclear → ask the user first

- Use /use-related-skills if needed

## Expected Outcome

- List of skills/files/patterns similar to the target, with similarity scores
- Summary of why each is similar
- Clear recommended next action
