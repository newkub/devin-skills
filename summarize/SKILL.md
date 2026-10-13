---
name: summarize
description: Summarize content for any general context
argument-hint: "<context>"
related:
  - scan-codebase
  - report
  - list-git
  - report-git-diff

---
## Goal

Summarize content for any general context such as a project, chat, code, files, or a specified topic

## Scope

Use when the user wants a summary without naming a specific sub-skill; `summarize` picks or delegates to the appropriate skill

## Execute

### 1. Identify Context

> Goal: Determine the context to summarize

1. Read the `<context>` argument or the context from the task
2. Determine the type: `project`, `chat`, `code`, `file`, `topic`, `conversation`, `changes`
3. If the context is unclear → ask the user
4. Determine the output format: bullet, paragraph, table, flow

### 2. Select Summarizer

> Goal: Pick the appropriate summarizer skill

1. If `project` → summarize the project scope following this skill's flow
2. If `chat` or `conversation` → summarize the chat/session scope following this skill's flow
3. If a bullet/numbered list is needed → run `/report`
4. If `code` → run `/scan-codebase` then `/report`
5. If `file` → read the file and summarize
6. If `changes` → run `/list-git-commit` or `/report-git-diff`
7. If nothing matches a sub-skill → summarize directly with `/report`

### 3. Summarize

> Goal: Summarize the content

1. Pass all input to the selected sub-skill
2. If summarizing yourself:
   - Read the original content
   - Identify main points and key takeaways
   - Remove unnecessary details
   - Order by priority
3. Preserve context and do not distort meaning

### 4. Format And Report

> Goal: Present the summary

1. Use the format the user wants (bullet, paragraph, table)
2. Use `/report` when there are multiple categories
3. Note anything missing or left to do
4. Run `/suggest-next-action`

## Rules

### 1. Context Aware

- Never guess content outside the context
- Ask the user when information is insufficient
- Pick the sub-skill based on context

### 2. Concise

- One bullet = one idea
- Use tight, concise language
- Keep only the essential substance

### 3. Accuracy

- Never distort meaning when trimming
- Preserve context
- State limitations if any

## Expected Outcome

- Summary matching the specified context
- Format as requested
- Complete yet concise content
- Next action identified if any
