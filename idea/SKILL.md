---
name: idea
description: Generate ideas according to user context, analyze gaps and opportunities
argument-hint: "[topic]"
related:
  - validate-idea
  - deep-review
  - reframe
  - report
  - suggest-next-action
  - implement-to-production
---
## Goal

Generate ideas according to user context, analyze gaps, needs and opportunities, then report as a table

## Scope

Use when the user says "I want ideas" or needs ideas for any work; covers features, UX/UI, refactor, and improvements
- References: [idea-create-devin-skills-global (merged content)](references/idea-create-devin-skills-global.md), [idea-new-skills (merged content)](references/idea-new-skills.md), [report-idea (merged content)](references/report-idea.md)

## Execute

### Idea Skills

| Topic | Skill |
|-------|-------|
| Feature ideas (extends + net-new + platform) | `/idea-features` |
| Ideas to merge/consolidate redundant things | `/idea-merge` |
| UX/UI improvement and feature ideas | `/idea-uxui` |
| Ideas for new/improved devin global skills | `/idea-agent-skills` |
| Skill candidates from the current session | `/idea-agent-skills` |
| Convert CLI tools into Devin skills | `/idea-convert-my-global-cli-to-skills` |
| Screen/prove a single idea before starting (GO/NO-GO/PIVOT in chat) | `/validate-idea` |

### 1. Analyze Context

> Goal: Analyze Context

Analyze context from the user request:

1. Identify the type of idea needed (features, UX/UI, refactor, improvements)
2. Identify scope from user context (project, module, file, workflow)
3. Identify pain points and gaps from the context

### 2. Generate Ideas

> Goal: Generate Ideas

Generate ideas according to the context:

1. If it's feature ideas, run `/idea-features` to generate new feature ideas and improve existing features
2. If it's UX/UI ideas, run `/deep-review` to generate UX/UI improvement ideas
3. Generate improvement ideas from what exists (Extends) — if you want review-driven improvements instead → `/improve <scope>`
4. Generate new ideas that don't exist yet (New)
5. Identify the problem each idea will solve
6. Group by topics

### 3. Prioritize And Report

> Goal: Prioritize And Report

Prioritize and report:

1. Prioritize by value vs effort
2. Identify quick wins and strategic ideas
3. Run `/report table` to show results as a table: `No.`, `Idea`, `Type`, `Problem`, `Impact`, `Effort`
4. If there is a follow-up action from the previous idea → use `/follow-your-suggestion`
4. Use Impact: 🔴 High → 🟡 Medium → 🟢 Low
5. Run `/suggest-next-action` to suggest the next action

## Rules

### 1. Context-Based

- Generate ideas according to user context, not generic
- Every idea must solve a real problem
- Don't generate ideas just because they're cool

### 2. Direct Execution

- If the user says "do ... for me", follow `/implement-to-production` directly
- Don't follow the normal workflow if the user orders directly
- Use /reframe if necessary

## Expected Outcome

- Ideas according to user context, prioritized by Impact
- Report as a table per `/report`
- Every idea solves a real problem
