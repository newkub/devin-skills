---
name: retry
description: Re-run the latest user prompt to fix an issue or try again
argument-hint: "[prompt]"
related:
  - dont-understand
  - follow-best-practice
  - suggest-next-action
  - loop-until-complete
  - resolve-errors
  - run-until-pass
---

## Goal

Re-execute the latest user prompt to fix an issue or try again, focusing on the root cause.

## Scope

Use when work must be redone per the latest user prompt, e.g. after an error, a failing result, or wanting to try a new approach.

## Execute

### 1. Identify Latest Prompt

> Goal: Know the latest prompt that must be redone

1. Read the latest user prompt from the conversation history
2. If not found, ask the user
3. Identify the current state and how far it got

### 2. Re-Execute

> Goal: Redo it and improve the result

1. Re-execute the latest user prompt
2. Fix problems at the root cause, not the symptoms
3. Always use minimal changes
4. If it still fails → run `/loop-until-complete` or `/resolve-errors` per context

## Rules

- Follow only the latest user prompt
- Fix at the root cause, not the symptoms
- Always use minimal changes
- If retried several times, record what was tried that did not work

- Use /dont-understand if needed
- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /resolve-errors if needed
- Use /run-until-pass if needed

## Expected Outcome

- The redone work is complete
- The problem is fixed at the root cause
- No regression from the retry
