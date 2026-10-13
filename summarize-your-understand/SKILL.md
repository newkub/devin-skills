---
name: summarize-your-understand
description: Summarize your understanding of a command or task before acting, and ask the user to confirm
argument-hint: "[topic]"
related:
  - ask-me
  - plan
  - rethink
  - deep-thinking
  - update-todo-md
  - report-file-structure
---

## Goal

Summarize your understanding of the task or command received, then ask the user to confirm before starting work

## Scope

Use when the prompt is long, has many items, or is high-risk — to reduce misunderstanding before acting

## Execute

### 1. Extract Key Points

> Goal: Pull the key information from the prompt

1. Identify the user's main goal
2. Identify the scope and boundaries
3. Identify the explicit constraints or requirements
4. Identify the questions or points that are still unclear

### 2. Summarize Understanding

> Goal: Summarize your own understanding

1. Summarize briefly in Thai in 3-5 lines
2. Break it into bullet points by topic
3. State what you will do, what you will not do, and what needs further questions
4. If there are multiple actions, put them in order

### 3. Identify Gaps

> Goal: Find the missing information

1. If there are questions that must be answered first → use `/ask-me`
2. If there is ambiguity → point it out clearly
3. If there are trade-offs → list the options for the user to choose

### 4. Ask For Confirmation

> Goal: Ask the user to confirm

1. Ask whether the understanding is correct
2. Ask whether to start right away or adjust first
3. If the prompt contains questions, keep asking until all are answered

## Rules

### 1. Answer In Prompt

- If questions must be answered, use `/ask-me` as a prompt instead of answering in chat
- Do not start work until all answers are in

### 2. Be Concise

- Summarize tightly; don't repeat the whole prompt
- Focus on the key points and the points that could be misunderstood

### 3. No Action Before Confirmation

- Do not edit files or run commands before the user confirms
- Except when the prompt is very clear and low-risk

### 4. Use Reports

- To show a detailed plan → use `/plan`
- To show a todo list → use `/update-todo-md` (reads `TODO.md`) or `/list-todo-gist` (gist)
- To show the file structure → use `/report-file-structure`

- Use /rethink when needed
- Use /deep-thinking when needed
- Use /plan when needed

## Expected Outcome

- A concise summary of your understanding
- Any questions for the user are asked through `/ask-me`
- The user confirms or corrects the understanding before work begins
