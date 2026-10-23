---
name: update-todo-md
description: Add, read, and enhance prompts from TODO.md in the project root
argument-hint: "[add|read] [title/content]"
related:
  - update-docs
  - plan
  - implement-to-production
  - continue
  - enhance-prompt
  - report
  - ask-me

---

## Goal

Manage `TODO.md` in the project root — add new tasks, read the content, and build an enhanced prompt in numbered + nested form, without doing the work itself

## Scope

- Use with `TODO.md` in the project root
- Supports 2 modes: `add` (add a task) and `read` (read + enhance prompt)
- Doesn't implement the work itself

## Execute

### 1. Identify Action

> Goal: Decide whether to add or read

1. Take the argument from the prompt or context
2. If there's a `<title>` or task content → `add` mode
3. If there's no title/content → `read` mode
4. If unclear → run `/ask-me`

### 2. Add New Task

> Goal: Record the request into TODO.md

1. Take the `<title>` and request content from the argument
2. If something's missing → ask the user
3. Validate the title as kebab-case with no special characters
4. If the title isn't valid → ask again or normalize it
5. Use the current date `YYYYMMDD`
6. Check `TODO.md` in the project root:
   - If missing → create it with `# TODO` and a table header:
     ```markdown
     | Title | Description | Status | Priority | Created |
     |---|---|---|---|---|
     ```
7. Append a new row at the end of the table:
   - `| <title> | <request> | pending | medium | <date> |`
8. If the request repeats an existing title → update the description instead of appending
9. If it's a monorepo → put the task in the `TODO.md` at the project root only
10. Report the `TODO.md` path

### 3. Read TODO.md

> Goal: Read the current TODO.md

1. Use `find_file_by_name` or `read` to locate `TODO.md` in the project root
2. If missing → report and stop
3. Save the original content to feed into `/enhance-prompt`

### 4. Enhance Prompt

> Goal: Produce a clear, well-organized prompt

1. Run `/enhance-prompt` using the content from `TODO.md` as input
2. Define the output format:
   - Main numbered list `(1., 2., 3., ...)`
   - Nested numbered list `(1.1, 1.2, ...)` for sub-items
   - Each item has a single responsibility
   - State the action, expected result, and clear conditions
3. Keep the enhanced prompt content

### 5. Suggest Next Steps

> Goal: The user knows what to do next

1. If you want a detailed plan → use `/plan`
2. If you're ready to implement → use `/implement-to-production`
3. If several tasks are queued → use `/continue` to work through them in order

### 6. Validate And Report

> Goal: Verify correctness and summarize

1. Check that every item is numbered
2. Check that nested items have sub-numbers
3. Check that there are no `` (bold markers)
4. Check that backticks are used for `tools`, `commands`, paths
5. Run `/report` to summarize the action, title, status, and next step

## Rules

### 1. Add Mode

- Use kebab-case for the title
- No special characters
- Don't execute the request immediately
- If the user wants it done right away → use another workflow

### 2. Read Mode

- Don't modify `TODO.md`
- Don't overwrite the file
- The user decides on any edits

### 3. Format

- Use a numbered list for main items
- Use a nested numbered list for sub-items
- Each item must be concise with a single responsibility
- Use backticks for emphasis instead of ``

### 4. Scope

- Responsible only for `TODO.md` at the project root
- If implementation is needed → use `/implement-to-production`
- If queueing in `QUEUE.md` is needed → use `edit` directly or create it with `write`
- Use /update-docs if needed


## Expected Outcome

- `TODO.md` has the new task correctly (add mode)
- `TODO.md` is read and understood (read mode)
- The enhanced prompt is in numbered + nested format
- No unauthorized edits are made to `TODO.md`
- Reported with the next action

