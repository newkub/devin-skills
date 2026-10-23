# Use In Another Skills

## Goal

Pick and use another skill that fits the current task or skill so the work can continue

## Scope

Use when the current task or skill needs another skill to carry on, with a clear set of candidate skills or context

## Execute

### 1. Analyze Context

> Goal: Understand the current situation

1. Read the context, goal, and current skill if present
2. Determine what kind of skill is needed: fix, check, create, research, deploy
3. If unclear → run `/ask-me` first

### 2. Get Candidates

> Goal: Find suitable skills

1. Run `/use-related-skills` if there is a current skill
2. Run `/suggest-next-action` for a general task
3. Run `/search-skills` to browse skill groups
4. Narrow the candidates down to 1-3

### 3. Select And Invoke

> Goal: Select and invoke a skill

1. Compare candidates on Goal, Scope, and constraints
2. Pick the most suitable skill
3. Invoke `/selected-skill` with complete context
4. If several skills are needed → repeat in order

### 4. Validate

> Goal: Confirm the result is usable

1. Check the output of the invoked skill
2. If it misses the goal → repeat steps 2-3
3. Run `/check-reference` if other skills were referenced

## Rules

### 1. Evidence Based

- Choose a skill from its Goal/Scope, not just its name
- Give a short reason before invoking
- Do not invoke an unrelated skill

### 2. Context Preservation

- Pass the important context to the chosen skill
- State the expected output and success criteria
- Keep a log of the skills invoked

### 3. Single Next Skill

- If several skills are not truly needed → pick one at a time
- If it is very complex → use `/use-subagents` instead

### 4. Validation

- Verify that the chosen skill actually exists
- Verify that the skill does not invoke itself
- Run `/report` for the summary

## Expected Outcome

- The most suitable skill is selected and invoked
- Context is passed on to the chosen skill
- A summary report of the skills used and their results exists
- Used together with `/use-related-skills` in `/update-agents-skills-global`
