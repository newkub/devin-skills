---
name: review-issue
description: Review any issue for clarity, scope, acceptance criteria, and readiness
---

## Goal

Review an issue (file, chat, or external tracker) for quality, clarity, completeness, and readiness before implementation

## Scope

Use for any issue source, not just GitHub. Covers title, description, acceptance criteria, scope, dependencies, risks, and actionable next steps. Does not edit the issue unless asked.

## Execute

### 1. Collect Issue Content
> Goal: get the full issue text and context

1. if the user provides an issue file or path, `read` it
2. if the user provides an issue number or URL, use the relevant tool or `ask_user_question` for details
3. if no issue is provided, `ask_user_question` for the title, body, and source
4. record the source, author, and any linked PRs or tasks

### 2. Check Completeness
> Goal: confirm the issue has enough information to start work

1. title is concise and describes the problem or goal
2. a clear `## Goal` or goal statement is present
3. `## Scope` or boundaries are explicit
4. acceptance criteria are listed and testable
5. dependencies, blockers, and related skills are named
6. environment, version, or context is included if relevant

### 3. Assess Quality
> Goal: identify clarity and feasibility issues

1. flag vague instructions such as "do the right thing" or "improve" without specifics
2. flag missing evidence, logs, screenshots, or file references
3. flag scope creep or multiple unrelated requests in one issue
4. flag TODO, MOCK, placeholder text that should be implementation-ready
5. identify duplicate or overlapping issues if known
6. check that the issue fits the project conventions and global rules

### 4. Rate Severity And Recommend
> Goal: produce an actionable review report

1. assign severity: Critical, High, Medium, Low, Info
2. group findings by severity with quote or reference evidence
3. recommend next action for each finding: ask for details, split issue, proceed, or use a specific skill
4. use `report-table` or `report-review` to summarize
5. run `suggest-next-action`

## Rules

### 1. Neutrality
- rate the issue, not the author
- every finding must include a quote or reference from the issue text

### 2. No Hidden Edits
- do not modify the original issue unless the user explicitly asks
- if suggesting edits, present them as a draft first

### 3. Scope Boundaries
- if the issue contains multiple unrelated requests, recommend splitting
- do not add work outside the stated scope

### 4. Actionable Output
- every finding must have a concrete recommendation
- output must include overall readiness: Ready, Needs Clarification, Blocked, or Not Ready

## Expected Outcome

- Issue review report with severity, evidence, and recommendations
- Clear statement of readiness
- List of missing information or blockers
- Suggested next action or skill to use
