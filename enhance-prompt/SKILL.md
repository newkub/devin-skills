---
name: enhance-prompt
description: Summarize a prompt into a numbered list, one single responsibility per item, for clear follow-up
argument-hint: "[scope]"
related:
  - ask-me
  - plan
  - continue
  - follow-devin-global-skills
  - reframe
  - report

---

## Goal

Summarize the user's prompt into a numbered list where each item has one single responsibility, so the team or agent can act on it clearly

## Scope

Use right after receiving a prompt, before planning or implementing, to split requirements into non-overlapping items

## Execute

### 1. Parse Prompt

> Goal: understand what the user asked for

1. Read the user's latest prompt from context
2. Identify the main goal, scope of work, and expectations
3. Identify constraints, references, or related files

### 2. Decompose Into Single Responsibilities

> Goal: split the prompt into the smallest units

1. Break each instruction or request into separate items
2. Check that each item does exactly one thing (one thing per item)
3. If an item contains multiple tasks → split it further
4. Order items by dependency or a sensible execution sequence

### 3. Format As Numbered List

> Goal: present the result in an easy-to-understand format

1. Summarize each item in a short, concise, clear sentence
2. Use the format `1. <responsibility> — <short detail>`
3. Each item must have a clear single responsibility
4. Order by prepare → read → research → analyze → write → validate → report where possible

### 4. Hand Off

> Goal: ready for the next step to take over

1. Show the numbered list in chat immediately
2. Do not implement or edit any files in this step
3. If the prompt is unclear → use `/ask-me` before summarizing

## Rules

### 1. Single Responsibility Per Item

- One item does one thing; never combine multiple requests in one item
- If an item contains several "and" or "," → split it further

### 2. Preserve Original Intent

- Keep the original meaning and requirements of the prompt
- Never expand or shrink scope without reason

### 3. Use Same Language As User

- Use the same language as the source prompt (Thai or English)
- Never switch languages between items

### 4. No Execution

- Do not edit files, run commands, or implement anything
- This is only a prompt summary
- Use /reframe if needed

## Expected Outcome

- A readable numbered list with a single responsibility per item
- Related files/tasks clearly identified
- The user's requirements fully conveyed without additions or omissions
- Ready to hand off to `/plan`, `/continue`, or `/follow-devin-global-skills`

