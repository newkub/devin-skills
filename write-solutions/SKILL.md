---
name: write-solutions
description: Write solution documents and systematic problem-solving workflows
argument-hint: "[scope]"
related:
  - analyze-root-cause-analysis
  - deep-research
  - reframe
  - deep-review-codebase
  - update-devin-global-skills
  - resolve-errors
  - dont-over-engineer
  - run-test

---

## Goal

Create solution documents and workflows for systematic problem solving

## Scope

Write solutions for problems found in development, operations, and business

## Execute

### 1. Analyze Problem

> Goal: Analyze Problem

Analyze the problem in detail

1. Run `/analyze-root-cause-analysis` to find the root cause
2. Identify the scope and impact of the problem
3. Gather context and constraints

### 2. Research Solutions

> Goal: Research Solutions

Find the most suitable fixes

1. Run `/deep-research` for relevant solutions
2. Read official docs and best practices
3. Study solutions used in other projects

### 3. Design Solution

> Goal: Design Solution

Design a solution that fits the context

1. Run `/deep-review-codebase` to design the structure
2. Consider trade-offs and alternatives
3. Set clear success criteria

### 4. Write Solution Document

> Goal: Write Solution Document

Write the solution document to standard

1. Run `/update-devin-global-skills` for structure
2. Write the problem statement, solution approach, and implementation plan
3. Add examples and edge cases

### 5. Validate And Refine

> Goal: Validate And Refine

Review and refine the solution

1. Run `/resolve-errors` to validate the solution
2. Test the solution against real scenarios
3. Improve based on feedback

## Rules

### 1. Problem Analysis

Analyze the problem deeply

- Identify the root cause with a systematic approach
- Measure the impact and priority of the problem
- Gather context: logs, metrics, user feedback
- Check assumptions and validate hypotheses

### 2. Solution Design

Design an appropriate solution

- Choose an approach that balances complexity and effectiveness
- Consider alternatives and trade-offs
- Set measurable success criteria
- Design for maintainability and scalability

### 3. Documentation Standards

Write the solution document to standard

- Use the structure: Problem, Analysis, Solution, Implementation, Validation
- Add code examples and diagrams as needed
- State dependencies and risks
- Write clearly for both technical and non-technical readers

### 4. Implementation Guidelines

Manage the implementation systematically

- Run `/resolve-errors` for minimal changes
- Run `/dont-over-engineer` to reduce complexity
- Add regression tests for critical fixes
- Document changes and update references

### 5. Validation And Monitoring

Verify and monitor the solution

- Run `/run-test` to validate in a production-like environment
- Set up monitoring and alerts for relevant metrics
- Collect feedback from users and stakeholders
- Improve the solution based on data and feedback
- Use /reframe when needed


## Expected Outcome

- Solution documents are well structured and easy to read
- Solutions are validated before implementation
- Monitoring and feedback loops exist for continuous improvement
- Solutions cover edge cases and long-term considerations

## Common Mistakes (optional)

Common mistakes:

- Fixing symptoms without analyzing the root cause
- Over-engineering solutions without considering trade-offs
- Lacking measurable success criteria
- Not testing solutions before deploy
- Not documenting or updating references after implementation
