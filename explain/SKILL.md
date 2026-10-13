---
name: explain
description: Clearly explain a concept, code, skill, term, or mechanism the user is asking about
argument-hint: "<target> [level|mechanism]"
related:
  - summarize
  - dont-understand
  - write-how-to
  - learn
  - deep-research
  - scan-codebase
  - deep-trace
  - report-flow

---

## Goal

Briefly and clearly explain the concept, code, skill, or term the user is asking about, with examples — and explain how a system, tool, library, or concept works step by step when the user asks "how does it work"

## Scope

Use when the user asks:
- "What is X", "explain X" → concise explanation
- "How does X work", "mechanism of X" → mechanism explanation diving into internals, not a how-to guide

## Execute

### 1. Identify Target, Level And Mode

> Goal: Identify Target, Level And Mode

1. Read `<target>` from the argument or context
2. Read `[level]` if present, e.g. `beginner`, `intermediate`, `advanced` — default `beginner`
3. Choose mode: if the question focuses on "how does it work"/mechanism → `mechanism` mode; if it asks "what is it" → `concise` mode
4. Identify the target type: `system`, `tool`, `library`, `code`, `concept`, `skill`
5. If the target is unclear → ask the user a short clarifying question

### 2. Gather Context

> Goal: Gather Context

1. If the target is in the current project → read the relevant files; for mechanism mode → run `/scan-codebase` or `/deep-trace`
2. If the target is a skill in the repo → read its `SKILL.md` with `/read` or `/read-related`
3. If the target is an external tool/library → use `/learn` or `/learn-from-web` to check official docs
4. Collect snippets, source paths, docs, and examples that help explain

### 3. Provide Explanation

> Goal: explain according to the chosen mode

#### Concise Mode

1. Give the definition or one-sentence summary first
2. Explain why it matters or when to use it
3. Give 3-5 key points
4. Give a suitable example or analogy
5. For code → explain the key lines and the result

#### Mechanism Mode

1. Identify inputs and outputs, key components/modules
2. Map out the data flow or execution flow including state changes, lifecycle, edge cases
3. Start with a short overview, then break the work into 3-7 steps
4. For each step state what happens, why, and how
5. Use `/report-flow`, `/report`, or `/draw-tldraw` if it helps visualize

### 4. Suggest Next Steps

> Goal: Suggest Next Steps

1. For more depth → suggest `/deep-research`
2. To follow along and do it → suggest `/write-how-to`
3. For a summary → suggest `/summarize`
4. Still unclear → hand off to `/dont-understand`

## Rules

### 1. Concise

- 3-5 sentences or bullets for concise mode
- mechanism mode may be longer, but 1 step = 1 idea
- If deeper detail is needed than this scope → hand off to another skill

### 2. Focus On Mechanism

- mechanism mode emphasizes "how", not "what" or "how-to"
- Explain the cause and effect of each step
- Avoid unnecessary detail that hurts understanding

### 3. Beginner Friendly

- Reduce jargon or explain technical terms
- Use familiar analogies
- Give concrete examples, not abstract ones

### 4. Accurate

- Never guess — cite official docs, code, or reliable sources
- If unsure → say so and suggest how to verify
- Use backticks for code, skill names, tools, component names

- Use /run-program if needed

## Expected Outcome

- A clear explanation of the target per mode — concise understood in 3-5 bullets; mechanism understood "why" and "how" step by step
- Includes an example or analogy that aids understanding
- Sources or next skills identified for deeper dives
