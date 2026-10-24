---
name: prioritize
description: Prioritize tasks and improvements by impact and effort
argument-hint: "[scope]"
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - deep-thinking
  - use-decision-model
---

## Goal

Prioritize tasks and improvements by impact and effort so that work is efficient.

## Scope

Use to prioritize tasks across development, maintenance, and improvement.

## Execute

### 1. Assess Impact

> Goal: Assess Impact

Assess the impact of the task

1. Assess `business impact`: revenue, user experience, compliance
2. Assess `technical impact`: performance, security, maintainability
3. Assess `user impact`: number of users affected
4. Assess `urgency`: deadline, dependencies, blocking issues

### 2. Estimate Effort

> Goal: Estimate Effort

Estimate the difficulty and time required

1. Assess `complexity`: complexity of the work
2. Assess `time`: expected time to spend
3. Assess `resources`: team, skills, tools required
4. Assess `risk`: risk of doing the work

### 3. Calculate Priority

> Goal: Calculate Priority

Calculate priority from impact and effort

1. Run `/deep-thinking` to review multiple perspectives before deciding priority
2. When a decision-model runtime is available → `/use-decision-model` to pre-rate `impact` and `effort` (`score`) and urgency (`noul`); treat it as an advisory pre-rate only — the matrix below stays the authority

| Impact | Effort | Priority | Rationale |
|--------|--------|----------|-----------|
| High   | Low    | P0       | Quick win, high value |
| High   | Medium | P1       | High value, moderate effort |
| High   | High   | P2       | High value, needs planning |
| Medium | Low    | P1       | Quick win, moderate value |
| Medium | Medium | P2       | Moderate value and effort |
| Medium | High   | P3       | Low priority, high effort |
| Low    | Low    | P2       | Quick win, low value |
| Low    | Medium | P3       | Low priority |
| Low    | High   | P4       | Defer or skip |

### 4. Consider Dependencies

> Goal: Consider Dependencies

Consider dependencies between tasks

1. Identify tasks that block other tasks
2. Identify tasks that are blocked by other tasks
3. Adjust priority according to dependencies
4. Order prerequisite tasks first

### 5. Validate With Stakeholders

> Goal: Validate With Stakeholders

Validate priority with stakeholders

1. Show the priority list with rationale
2. Ask for feedback from stakeholders
3. Adjust priority according to feedback
4. Confirm the final priority

## Rules

### Impact Assessment

Assess impact thoroughly

- Always assess `business impact` first
- Assess `technical impact` for long-term health
- Assess `user impact` for immediate value
- Assess `urgency` for time-sensitive tasks
- Use quantitative metrics when possible

### Effort Estimation

Estimate effort realistically

- Assess `complexity` accurately
- Assess `time` including buffer
- Assess the `resources` required
- Assess the `risk` of doing the work
- Use historical data when possible

### Priority Matrix

Use the matrix to set priority

- P0: High impact + Low effort (quick wins)
- P1: High impact + Medium effort or Medium impact + Low effort
- P2: High impact + High effort or Medium impact + Medium/Low effort
- P3: Medium impact + High effort or Low impact + Medium effort
- P4: Low impact + High effort (defer or skip)

### Dependencies

Consider dependencies appropriately

- Tasks that block others must be done first
- Blocked tasks must wait for prerequisites
- Adjust priority according to the dependency chain
- Consider parallel execution when possible

### Stakeholder Validation

Validate priority with stakeholders

- Show rationale clearly
- Ask for feedback from all stakeholders
- Adjust priority according to business needs
- Confirm the final priority before starting

- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /resolve-errors if needed

## Expected Outcome

- Tasks are prioritized correctly
- Priority aligns with business goals
- Resources are allocated efficiently
- Dependencies are managed appropriately
- Stakeholders agree with the priority decisions
