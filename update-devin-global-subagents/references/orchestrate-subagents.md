# Orchestrate Subagents

## Goal

Split complex work into subtasks and use subagents by job role to work in parallel, merge results, and deliver everything

## Scope

Use when a task spans multiple areas, e.g. frontend + backend + QA + DevOps, or when perspectives from multiple roles are needed at once

## Execute

### 1. Decompose Task

> Goal: split the work into independent subtasks

1. Analyze the main task and identify the areas involved
2. Break it into subtasks by layer: frontend, backend, qa, devops, security, architecture
3. Each subtask must have a clear input, expected output, and success criteria
4. If subtasks are dependent → order them

### 2. Select Subagents By Role

> Goal: pick the subagents that match the subtasks

1. Run `/list-devin-global-subagents` to see the available subagent pool
2. Select roles based on the expertise needed
3. If a needed role doesn't exist → run `/use-related-skills` or create a new AGENT.md via `/update-devin-global-subagents`
4. State which subtask each subagent handles

### 3. Spawn Subagents

> Goal: hand work to subagents to run in parallel

1. Use `/use-subagents` to spawn multiple subagents at once
2. Pass complete context: task, constraints, files, expected output
3. Set a timeout or number of rounds
4. Never assign duplicate/overlapping subtasks

### 4. Merge Results

> Goal: combine subagent results into a single deliverable

1. Collect output from every subagent
2. Resolve conflicts or contradictions with `/resolve-errors`
3. Order the results by impact
4. Clearly call out any contradictory recommendations that were excluded

### 5. Review And Fix

> Goal: check the quality of the merged result

1. Run `/deep-review-then-fix` on the output
2. If any subtask has a complex workflow or flow, run an additional `/deep-review`
3. If there are gaps, spawn more subagents
4. Verify the result answers the original scope

### 6. Validate And Ship

> Goal: deliver a validated result

1. Run `/deep-validate`
2. Run `/deep-validate` if the work is high risk
3. Run `/ship` if there are changes
4. Run `/report` summarizing what each subagent did

## Rules

### 1. One Role Per Subtask

- Each subagent takes one role; don't mix multiple roles
- If multiple roles are needed, spawn multiple subagents

### 2. Clear Context

- Every subagent must receive clear context
- Specify input, expected output, constraints

### 3. No Duplication

- Don't split overlapping subtasks
- If 2 subagents do similar work, merge them or pick one

### 4. Merge Before Final

- Results from all subagents must be merged before delivery
- Never deliver a single subagent's output as the final work without merging

### 5. Validate Parallel Work

- Check references and circular dependencies
- Run check/test after merging

## Expected Outcome

- Work is decomposed and executed in parallel by subagents
- Results are merged and reviewed
- Passed `/deep-validate`
- A summary report exists for each role

