---
name: write-explicit
description: Write or revise instructions to be clear, measurable, and single-responsibility
argument-hint: "[scope]"
related:
  - write-how-to
  - write-solutions
  - follow-best-practice
  - reframe
  - deep-validate
  - improve-writing

---

## Goal

Write or revise instructions, prompts, rules, or documentation so they are clear and immediately actionable, with no guessing.

## Scope

Use when work needs clarity improvements to a skill, prompt, rule, or any document.

## Execute

### 1. Identify Target

> Goal: Pin down the content that needs clarifying

1. Read the target to improve (prompt, skill, rule, doc)
2. Spot the points that are ambiguous, implicit, or open to multiple meanings
3. Record a list of the unclear files/lines/wording

### 2. Extract Core Intents

> Goal: Determine what the reader must know before acting

1. Identify the `action` the reader must take
2. Identify the `condition` or `if` before the action
3. Identify a measurable `expected result`
4. If any of the three is missing → treat it as ambiguous

### 3. Rewrite Explicit Instructions

> Goal: Rewrite as a clear sequence that needs no interpretation

1. Split each step into one unit only (single responsibility)
2. Use active verbs: `do`, `run`, `check`, `stop` — not just `consider`
3. Always state the input/output or a command example
4. Use backticks for `tools`, `commands`, `file paths`, `skill-name`
5. Remove filler words: "if possible", "maybe", "should", "generally" unless truly needed
6. If there are multiple options → state the decision criteria before each branch

### 4. Validate Clarity

> Goal: Verify that users can actually follow the instructions

1. Read it all and answer: What is done? When is it done? What is the desired result?
2. If any question can't be answered → go back and fix that point
3. Run `/deep-validate` to check structure and references

## Rules

### 1. No Ambiguity

- Every instruction must state action + condition + expected result
- Never use "handle", "take care of", or "something like this" without specifics

### 2. One Thought Per Step

- 1 step = 1 unit, never mixing multiple concerns
- If you find "and" or "/" in an instruction → split the step

### 3. Measurable Outcomes

- Every expected outcome must be verifiable
- Use "passes X", "creates Y", "has Z", not "better" or "appropriate"

### 4. No Placeholder Filler

- No "TODO", "...", "e.g.", or generic examples without real specifics
- If a placeholder is required → add a clear note on what value it must be replaced with

### 5. Consistent Terminology

- Use the same tool/skill names throughout the file
- Always keep skill names in backticks

- Use /write-how-to if needed
- Use /write-solutions if needed
- Use /follow-best-practice if needed
- Use /reframe if needed


## Expected Outcome

- The target is actionable immediately without further questions
- Every step has a clear single responsibility
- No ambiguous words, filler, or unnecessary placeholders
- Passes `/deep-validate` and a manual check
