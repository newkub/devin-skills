---
name: suggest-next-action
description: Analyze the situation and suggest the next action with /ask-me — ask until unclear intent is clear
argument-hint: "[context]"
related:
  - loop-until-complete
  - follow-enter-dot
  - follow-agents-md
  - report
  - ask-me
  - ship
  - continue
  - rethink

---
## Goal

Analyze the current situation and suggest the next action to take, so the work has clear direction and stays systematic

## Scope

Use to analyze the situation after finishing any task or when unsure what to do next. Covers both the project context and the current state, and explains what is in progress if the user asks.

- If the user's intent is still unclear (only says "I want to build..." / "I want features...") → run Step 4 (Clarify Vague Intent — merged from `/suggest-me`) before suggesting actions

## Execute

### 1. Analyze Current State

> Goal: Analyze Current State

Analyze the current situation

1. Check the most recently completed task
2. Look at the project state (errors, warnings, pending changes)
3. Check git status (uncommitted changes, branches)
4. Look at dependency status (outdated, vulnerabilities)
5. Check test coverage and test failures
6. Look at documentation that may need updating
7. Check whether `AGENTS.md` exists and which workflows it defines
8. Check whether the next piece of work can be split into independent subtasks

### 2. Explain What You Do (If Asked)

> Goal: Report what you are doing in real time

1. If the user asks "what are you doing" or "why are you doing this" → state:
   - `what` — what is being done
   - `why` — a short reason
   - `next` — the next 1-2 steps
2. Use symbols: 🔄 in progress, ⏳ waiting, ✅ done, ⚠️ blocked
3. Don't over-share long logs; summarize the essentials

### 3. Identify Context

> Goal: Identify Context

Identify the context of the situation

- Starting a new project or maintenance
- Fixing a bug or adding a feature
- Refactoring or optimizing
- Preparing for a release
- Reviewing or auditing
- Learning or researching

### 4. Clarify Vague Intent (merged from `/suggest-me`)

> Goal: Understand what the user wants before suggesting — for requests that are still unclear

Use when the user only says "I want to build.../I want features..." without a defined scope — merged from the old `/suggest-me`:

1. Ask with `/ask-me` 1-4 questions per step — goal, users, scope, priorities; if the user is unsure → offer options + a recommendation
2. Keep asking until fully understood → summarize as short bullets in chat for the user to confirm — never create report files
3. After confirmation → continue to Step 5 to suggest actions, or hand off to `/idea-features`, `/implement-to-production`, `/create-plan-in-dot-devin` per context

### 5. Evaluate Priority

> Goal: Evaluate Priority

Assess the importance of the possible actions

- Impact on users (high/medium/low)
- Impact on stability (high/medium/low)
- Effort required (high/medium/low)
- Risk of doing it (high/medium/low)
- Dependencies on other tasks
- Time sensitivity

### 6. Suggest Actions

> Goal: Suggest Actions

Suggest the actions to take next

1. Rank the actions by priority
2. Recommend a suitable workflow (if one exists)
3. Mark each action as critical or optional
4. Explain the reason for recommending each action
5. Identify dependencies between actions
6. Give an effort estimate when possible
7. If there are files or folders that should be deleted, recommend `git rm` with a stated reason, then `/update-references`
8. If there are files whose content should be summarized, recommend `/report`
9. If `AGENTS.md` exists → recommend `/follow-agents-md` as the primary action instead of doing things directly
10. If the work has many independent subtask areas (frontend/backend/qa/devops/security) → recommend `/update-devin-global-subagents` or `/use-subagents` per context
11. If in a brainstorming phase or the user wants feature ideas → recommend `/idea-features` for initial ideas, or `/idea-features` if a plan/implementation is wanted

### 7. Present Options

> Goal: Present Options

Prepare the options to present

1. Prepare action data for `/report`: #, Action, Priority, Impact, Effort, Workflow, Reason
2. Order the recommended actions with their priorities
3. State the best action for each context, but do not decide for the user
4. Prepare the trade-offs between options for `/report`: Option, Pros, Cons, Risk
5. Mark which actions can run in parallel
6. If user confirmation is needed before proceeding → save the questions for `/ask-me` after `/report`

### 8. Report

> Goal: Present the results so the user sees the big picture

1. Always run `/report` to format actions, options, and trade-offs as tables
2. Put a 1-2 line summary of the main recommendation before the tables
3. State the best next action with a short reason, but do not decide for the user
4. Always run `/ask-me` to have the user pick an action as the answer; do not decide for the user in chat

## Rules

### 1. Context Awareness

Understand the context before suggesting

- Never suggest actions without understanding the context
- Check the current state first
- Consider the impact on the overall project
- Consider the state of the codebase

### 2. Priority Framework

Use a framework for ordering

- High impact, low effort → do first
- High impact, high effort → plan carefully
- Low impact, low effort → do when there's time
- Low impact, high effort → do only when necessary
- Critical issues → do immediately
- Blockers → do before anything else

### 3. Action Categories

Split actions into categories:

- Critical: must do immediately (security issues, blocking bugs)
- High: should do soon (features, important fixes)
- Medium: do when there's time (refactor, improvements)
- Low: do when free (nice-to-have)
- Optional: take it or leave it (experiments, learning)

### 4. Workflow Suggestions

Recommend the suitable workflows

- If a workflow already covers the action, recommend that workflow
- Never recommend workflows that don't exist
- Check `related_workflows` before recommending
- Explain why the workflow is a good fit

### 5. Clarity And Specificity

Give clear, specific advice

- Never vaguely suggest "what should we do" without specifics
- Keep suggestions specific and actionable
- Name the relevant file paths or components
- Give examples when needed

### 6. Agent And Subagent Discipline

Use `/follow-agents-md` and subagents correctly

- If `AGENTS.md` exists → recommend `/follow-agents-md` first; don't do things directly
- If the work needs multiple roles/perspectives → recommend `/update-devin-global-subagents` or `/use-subagents`
- Never recommend a subagent or skill unrelated to the task
- Check `related` and `AGENTS.md` before referencing a workflow or subagent
- If unsure which subagent to use → run `/ask-me` first

### 7. Trade-off Awareness

Explain the trade-offs between options

- Explain the pros and cons of each option
- State the risks that may arise
- State the opportunity costs
- Let the user make the final decision

- Use /loop-until-complete when needed
- Use /follow-enter-dot when needed
- Use /report when needed
- Use /ship when needed
- Use /continue when needed
- Use /idea-features or /idea-features when needed
- Use /rethink when needed

## Expected Outcome

- The user receives clear recommendations
- Actions are ranked by priority
- The context of the situation is understood
- The suitable workflows are recommended
- The trade-offs between options are clear
- The work has clear direction
- Results are presented via `/report` as tables
- If `AGENTS.md` exists, `/follow-agents-md` is recommended first
- If the work is complex and multi-role, `/update-devin-global-subagents` or `/use-subagents` is recommended per context
- If the user wants feature ideas, `/idea-features` or `/idea-features` is recommended per context
- Ends with `/ask-me` so the user picks an action as the answer; the assistant does not decide for the user in chat

