---
name: pick-bestest
description: Ask the user to pick the best one from a list of options — only one choice allowed
argument-hint: "[question] [options...]"
related:
  - ask-me
  - summarize-your-understand
  - report
  - follow-create-cli
  - deep-review
  - plan
  - use-decision-model
---

## Goal

Ask the user to choose the single best option from a list when there are multiple alternatives.

## Scope

Use when there are multiple options and only one answer is needed, e.g. choosing a skill, architecture, stack, priority, next action, or the best alternative.

## Execute

### 1. Prepare Options

> Goal: Prepare options clearly

1. Take the question to ask and the list of options
2. Check that the options are not duplicated
3. If there are more than 10 options → group or filter them before asking
4. If the options are unclear → run `/summarize-your-understand` first
5. State a recommendation if any, by marking `(recommended)` or a short explanation
6. When a decision-model runtime is available → `/use-decision-model` over the options as `choice`; mark `(recommended)` only at `confidence ≥ 0.6`, and keep every option on the list for the user to choose

### 2. Ask User

> Goal: Ask the user to choose one

1. Show the question with the options as a numbered list
2. Each option may have a short one-line description
3. Use `/ask-me` or `ask_user_question` so the user chooses one
4. The last option is always `Other`, for answers outside the list
5. Do not start further work until the user answers

### 3. Process Answer

> Goal: Use the user's answer

1. Check which option the answer matches
2. If the user chooses more than 1 → state that only one can be chosen, then ask them to choose again
3. If they choose `Other` → wait for the user to specify an additional answer
4. If the user answers "every one" or "all" → ask which one is primary, or ask them to choose one
5. Record the answer and proceed according to the chosen alternative

## Rules

### 1. Single Choice Only

- Ask for a single choice only
- If multi-select is needed → use `/ask-me` or another skill
- If the user answers several → state it and ask them to choose again

### 2. Clear Options

- Each option must have a distinct, understandable name
- Order by priority, quality, or suitability
- The best option should be at the top, or marked `(recommended)`
- Do not include ambiguous options

### 3. General Purpose

- Works in any context, not tied to skill creation
- Can be called from other skills, e.g. `/follow-create-cli`, `/deep-review`, `/plan`
- Returns the single option the user chose

### 4. References

- If the options are skills → use `/<skill-name>`
- If the options are URLs/paths → use backticks
- If more explanation is needed → use `/report`

## Expected Outcome

- The user chooses one from the list of options
- The answer is recorded and passed to the next step
- If `Other` is chosen, a confirmation is asked first
- No further work until the user answers
