---
name: generalize
description: Convert how-tos or instructions into general, reusable solution patterns
argument-hint: "[scope]"
related:
  - write-explicit
  - deep-validate
  - check-reference
---

## Goal

Convert a skill or document written as a step-by-step how-to into general solution patterns that state the problem, conditions, alternatives, and decision criteria, without being tied to a specific tool/library/context

## Scope

Use when a skill or text must be rewritten so that:
- It is not a how-to for a single tool
- It can be used in multiple contexts with minor adjustments
- Reading it tells you how to solve the problem, rather than just following a sequence of steps

## Execute

### 1. Detect How-To Patterns

> Goal: Find the places written as a specific step-by-step

1. Read the target `SKILL.md` or document
2. Mark every item that starts with `install`, `run`, `add`, `edit`, `configure` without a condition
3. Find the tool/library names that appear often and ask whether they are examples or the actual target
4. Record the patterns found as a list

### 2. Extract Problem And Context

> Goal: Identify the general problem the skill solves

1. Ask: "Without this specific tool/library, what is the problem?"
2. State the problem in the form: `When <situation> occurs, <negative effect> happens`
3. Identify the general context that makes the solution differ
4. Remove the tool/library names from the problem statement

### 3. Define Solution Pattern

> Goal: Turn the steps into a general pattern

1. Turn the sequence of steps into the form: `When <condition> → <solution pattern> → <expected result>`
2. Replace tool names with their type: `package manager`, `bundler`, `linter`, `database`, `runner`, `registry`
3. Identify the decision criteria between alternative solutions
4. If there are multiple solutions → use a decision tree or `choose X if Y` bullets

### 4. Generalize Step Instructions

> Goal: Each step is not tied to a tool/technology

1. Change specific commands, e.g., `bun add` to `install package with the package manager the project uses`
2. Use generic verbs: `prepare`, `configure`, `run`, `verify`, `fallback`, `isolate`
3. Always state the condition before the command
4. Never copy the tool's official docs into the skill

### 5. Add Concrete Examples

> Goal: Provide a mental picture without tying the skill to any one tool

1. Include 2-3 differing examples (e.g., web, CLI, mobile, backend)
2. The examples must have `given → when → then`
3. If there is sample code → state that it is only an example and replace it with the type name

### 6. Validate Generalization

> Goal: Check that the skill is genuinely reusable

1. Read the whole skill then ask: "If the tool changes, how many points must be edited?" If too many → go back and generalize further
2. Run `/write-explicit` to check clarity
3. Run `/deep-validate` to check the structure and references
4. Run `/check-reference` to confirm that `related` is correct

## Rules

### 1. Problem First

- Start from the problem, not the steps
- Every solution pattern must explain what problem it solves

### 2. Conditional Not Prescriptive

- Use `if X → do Y` instead of a bare `do Y`
- State the limitations/edge cases that make the solution differ

### 3. Tool-Agnostic

- Do not tie the skill to any one tool/library
- If a real tool must be named → use it as an example, not as the default

### 4. Reusable Patterns

- Each pattern must be reusable in other contexts
- Avoid project-specific details or commit hashes

### 5. Explicit And Concise

- Every instruction has an action, condition, expected result
- Do not use how-to filler or vague generic advice

## Expected Outcome

- The skill or document is no longer written as a how-to
- Every section states the problem, conditions, alternatives, and decision criteria
- It can be applied to multiple tools/libraries with minor adjustments
- It passes `/deep-validate` and `/check-reference`
