# deep-follow (merged content)

## Goal

Track down and execute `deep-*` workflows that have deeply nested sub-workflows or skills, recursively, until they are complete and verified

## Scope

Use when the main work has selected a `deep-*` workflow and that workflow turns out to contain deeply nested sub-workflows/skills that must be completed in full — it is not a standalone main workflow

## Execute

Step dependencies: follow the order, but each group can run in parallel

### 1. Identify Parent Workflow

> Goal: identify the parent workflow/skill to follow

1. Identify the parent workflow/skill from the context or user argument
2. If unclear → run `/ask-me`

### 2. Load Parent Skill

> Goal: load the instructions to find sub-workflows

1. Use `skill` or `read` on the parent `SKILL.md`
2. Record `## Execute`, `## Rules`, and `related`

### 3. Discover Sub-Workflows

> Goal: find all sub-workflows/skills inside the parent

1. Use `grep` to find references matching `/deep-*`, `/follow-*`, `/deep-validate`, `/follow-parallel`
2. Remove duplicates and keep only those appearing in `## Execute`
3. Determine dependencies from `Step dependencies:` or the numbered-list order

### 4. Plan Execution

> Goal: order the work and parallelize safely

1. Sequence by dependencies: prerequisites first
2. Find independent groups for parallel execution
3. If there are independent groups, use `/update-devin-global-subagents` or `/follow-parallel` as appropriate
4. Set a max recursion depth to prevent infinite loops

### 5. Execute Sub-Workflows

> Goal: carry out the plan

1. Invoke `skill` for each sub-workflow in order or in parallel
2. If a sub-workflow has nested sub-workflows → call `/follow-deep` recursively
3. Record the results and errors of each step

### 6. Verify And Report

> Goal: confirm everything was completed

1. Run `/deep-validate` to verify the results
2. Check that no sub-workflow was skipped
3. Run `/report` with a summary, listing the steps done and next actions

## Rules

### 1. Recursion Safety

- Keep a `visited` stack of parent skills to prevent loops
- Max recursion depth = 5 (adjustable to context)
- If a parent repeats in the `visited` stack → stop and report

### 2. Reference Filtering

- Follow only the references that appear in the parent's `## Execute`
- Do not follow skills merely mentioned in `## Rules` or `## Expected Outcome` without being invoked
- If a reference does not exist → stop and `/report`

### 3. Parallelism

- Use `/follow-parallel` for independent sub-workflows
- Limit each parallel group to at most 10 per batch
- Sub-workflows with dependencies must run in order

### 4. Deep-Only

- Use `/follow-deep` only when the work has complex sub-workflows
- For a leaf workflow with no sub-workflows → run it directly without recursion

## Expected Outcome

- Sub-workflows are executed in full according to their dependencies
- No infinite recursion occurs
- Parallel execution is done safely
- A summary report of results and next actions exists
