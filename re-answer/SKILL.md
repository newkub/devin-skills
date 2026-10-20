---
name: re-answer
description: Review the question and answer again more thoroughly and completely
argument-hint: "[scope]"
related:
  - report
  - rethink
  - ask-again
  - retry
  - deep-thinking
  - suggest-next-action
---

## Goal

Review the question the user asked, analyze points that may have been answered incompletely or unclearly, then answer again more concisely, completely, and actionably

## Scope

Use when the user says the answer was not good enough or incomplete, or wants the original question reviewed and answered again

## Execute

### 1. Review Original Question And Answer

> Goal: Understand the question and the points that must be answered clearly

1. Read the original question and the original answer the user asked about
2. Identify the keywords, intent, and context of the question
3. Break the question into sub-questions
4. Identify which points the original answer covered and where it was missing or unclear

### 2. Identify Gaps

> Goal: Find the parts that need improvement

1. Check whether the original answer really answers the question
2. Identify information that is missing, inaccurate, or needs clarification
3. Consider other perspectives such as trade-offs, edge cases, prerequisites
4. Record the gaps along with the reasons

### 3. Re-answer With Three Column Table

> Goal: Provide a better new answer

1. Answer each point in order
2. Use new information or additional context if available
3. Make the answer concise, clear, and systematic
4. If there are multiple alternatives, compare them and recommend the best one with reasons
5. Use `/report` to summarize as a 3-column table:
   - Column 1: `Question point`
   - Column 2: `What is missing or must be reviewed`
   - Column 3: `New answer / Improvement`
6. If the table has many rows, group by topic or phase

### 4. Validate And Suggest

> Goal: Check completeness and suggest the next step

1. Review that every sub-question received an answer
2. Check that the answer does not contradict the original information
3. If still unsure, state the uncertainty
4. Run `/suggest-next-action`

## Rules

### 1. Honest Review

- Accept that the original answer may be missing or wrong
- No need to defend the original answer
- State the gaps plainly with reasons

### 2. Evidence Based

- The new answer must be based on the existing context, data, or conventions
- If there is not enough information, state it as an assumption

### 3. Structured

- Break the answer into points
- Use a 3-column table in `### 3. Re-answer With Three Column Table`
- Always run `/suggest-next-action` at the end

### 4. Concise

- Do not answer too long
- One point, one answer
- Use bullet points for secondary details

- Use /rethink if needed
- Use /ask-again if needed
- Use /retry if needed
- Use /deep-thinking if needed

## Expected Outcome

- The question is clearly broken into sub-questions
- The gaps of the original answer are identified
- The new answer is more complete, more concise, and more actionable
- The report comes out as a 3-column table
- There is a clear next action
