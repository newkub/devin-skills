# report-idea (merged content)

## Goal

Analyze the context the user provides, then generate ideas/proposals and report them in an easy-to-read table format

## Scope

Use when the user wants general ideas from context: a problem, project, workflow, skill, feature, or any topic

## Execute

### 1. Analyze Context

> Goal: Understand the user's context

1. Read the prompt and the provided context
2. Identify the domain: `project`, `skill`, `feature`, `workflow`, `product`, `code`
3. Identify constraints: time, budget, tech, team
4. If the context is unclear → ask the user

### 2. Generate Ideas

> Goal: Generate ideas in multiple directions

1. Brainstorm ideas from the context
2. Categorize: options A/B/C, short-term/long-term, low/high effort
3. Assess each idea with criteria: impact, effort, risk, feasibility
4. Remove ideas that are duplicate or unsuitable

### 3. Structure Ideas

> Goal: Structure the ideas

1. Pick the top ideas, no more than 10
2. Define the columns:
   - No.
   - Idea
   - Category
   - Impact
   - Effort
   - Risk
   - Feasibility
   - Next Step
3. Sort by Impact then Effort
4. Use grouping by Category

### 4. Report

> Goal: Present the ideas with a table

1. Use `/report table` to show the ideas
2. Use `/report-before-after` if you want a report of the state before starting
3. Specify the top 3 ideas that should be done first
4. Run `/suggest-next-action`

## Rules

### 1. Context First

- Don't guess ideas outside the context
- Ask the user if the information isn't enough
- Use keywords from the prompt to shape the ideas

### 2. Actionable

- Every idea must have a clear Next Step
- Don't propose ideas that are too broad
- Specify the expected outcome

### 3. Feasible

- Assess effort roughly (S/M/L)
- Specify real risks
- Don't propose ideas that conflict with the constraints

### 4. Format

- Answer in chat with a markdown table
- Every table must have the "No." column as the first column, ordered 1, 2, 3, ...
- Use symbols for impact/effort/risk
- Group by category

## Expected Outcome

- A list of ideas consistent with the context
- A table with the "No." column as the first column, ordered 1, 2, 3, ... with impact, effort, risk, feasibility
- The top 3 ideas that should be done first
- A clear next action
