---
name: dont-understand
description: Handles user confusion — re-ask plainly with examples, or re-answer the Q&A more completely
argument-hint: "[scope]"
related:
  - ask-me
  - ask-project-requirement
  - follow-my-persona
  - dont-ask-me
  - continue
  - deep-thinking
  - report
  - suggest-next-action
  - retry

---

## Goal

Handle cases where the user does not understand, by re-asking a question plainly, re-explaining briefly, or re-answering more completely

## Scope

Use when the user types "don't understand", "I don't understand", "dont understand", "confused", "lost", "ask again", "repeat", or says the previous answer was not good enough or incomplete

Not for gathering requirements (use `/ask-project-requirement`) or preference interviews (use `/follow-my-persona`)

## Execute

### 1. Detect Confusion

> Goal: Recognize that the user does not understand

1. Capture signals: "don't understand", "I really don't understand", "dont understand", "confused", "lost", "don't get it", "makes no sense", "explain more", "ask again", "repeat", "can't follow"
2. Also trigger when the user says the previous answer was not good enough, wrong, or incomplete
3. Find the latest question or explanation the assistant asked/told
4. If no recent context is found → ask back briefly: "Could you tell me which part is unclear?"

### 2. Choose Response Strategy

> Goal: Route to the right remedy

1. A previous question was not understood → `### 3. Re-ask`
2. A previous explanation was not understood → `### 4. Re-explain`
3. A previous answer was incomplete or not good enough → `### 5. Re-answer`
4. If the user asks a specific question → answer only that point
5. If information is insufficient → use `/ask-project-requirement`
6. If the user just wants to proceed → use `/dont-ask-me`

### 3. Re-ask

> Goal: Re-ask the question so the user can answer it

1. Analyze why it was unclear: too long or complex, jargon, missing context, too many options or unclear labels
2. Shorten the `question` to 1-2 brief sentences; remove or replace jargon with plain words
3. Add brief context explaining why the question is asked, e.g. "to pick the runtime that fits the project"
4. Give a short example or comparison in `description`
5. Too many options → cut to the 2-3 most important; too complex → split into 2 sub-questions
6. Send with the `ask_user_question` tool only — keep the original `options` and the recommended option, keep `multi_select` as the original, reword `label` and `description`, and say this is a re-ask, e.g. "Let me ask that again — ..."

### 4. Re-explain

> Goal: Explain again in an easy-to-understand way

1. Acknowledge the confusion first, e.g. "No problem, let me explain again"
2. Reduce jargon and difficult words; keep a single explanation to no more than 3-5 sentences
3. Use short examples or analogies
4. For code/technical topics, cut the fine details and emphasize the big picture
5. If no question is needed → summarize the solution clearly and proceed

### 5. Re-answer

> Goal: Answer the original question again, more completely and actionably

1. Re-read the original question and answer; extract keywords, intent, and context; break the question into sub-questions with `/deep-thinking` if needed
2. Identify gaps: points the original answer missed, stated inaccurately, or left unclear; consider trade-offs, edge cases, and prerequisites
3. Accept that the original answer may be missing or wrong — no defending; state the gaps plainly with reasons
4. Re-answer each point: concise, complete, actionable; where there are alternatives, compare them and recommend one with reasons (based on existing context, data, or conventions — anything else stated as an assumption)
5. Summarize with `/report` as a 3-column table: `Question point` | `What is missing or must be reviewed` | `New answer / Improvement` — group rows by topic when there are many
6. Check that every sub-question got an answer and nothing contradicts the original information; state remaining uncertainty; end with `/suggest-next-action`

### 6. Handle Loop

> Goal: Never go in circles

1. Count re-asks — at most 2
2. On the 2nd attempt → ask open-endedly ("Which aspect would you like explained further?") or reduce to the 2 clearest options
3. On the 3rd or later → use `/dont-ask-me` or `/continue` with the safest default; if the user says to stop asking → stop immediately
4. Process the response: pair each question with its answer; if the user answered in their own words → adjust the plan and continue

## Rules

### 1. Empathy

- Never blame the user for not understanding
- Use a helpful tone, not defensive

### 2. No Exact Repeat

- Never copy the original message verbatim; always rephrase, summarize, or add examples
- For a re-ask, change at least one of `question`, `label`, or `description`

### 3. Preserve Intent

- Keep the original ask and the intended answer intact
- Don't change single-select to multi-select without a reason; don't add irrelevant options

### 4. Tool Discipline

- If you must ask the user → use the `ask_user_question` tool only, never plain chat text

### 5. Escalation

- Confusion from missing information → `/ask-project-requirement`
- The user wants preferences/style applied → `/follow-my-persona`
- The user says stop asking/just do it → `/dont-ask-me`
- A failed attempt should be retried, not re-asked → `/retry`

- Use /ask-me if needed
- Use /continue if needed

## Expected Outcome

- The user understands the re-asked question or the new explanation and can answer
- After a re-answer, the gaps are identified and the 3-column table shows the improved answer
- Less repeated confusion; the flow is preserved without anything left hanging
- If still unclear after 2-3 attempts, there is a clear way forward (default, open-ended, or handed off to another skill)
