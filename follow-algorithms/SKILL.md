---
name: follow-algorithms
description: Choose and implement algorithms that fit the problem and complexity
argument-hint: "[scope]"
related:
  - follow-math-concepts
  - deep-review
  - ask-me

---

## Goal

Choose and implement the algorithm that fits the problem, with correct complexity analysis

## Scope

Use when selecting or implementing a new algorithm — to assess an existing one use `/deep-review`; to adjust an existing one use `/deep-review`

## Execute

### 1. Understand The Problem

> Goal: analyze the problem before choosing an algorithm

1. Define the desired input/output
2. Define the constraints (time, space, data size)
3. Identify edge cases
4. If unclear, use `ask-me`

### 2. Choose Algorithm

> Goal: choose the algorithm by characteristics

1. Look up common algorithms for this problem class (sorting, searching, graph, DP, greedy)
2. Compare time/space complexity
3. Consider implementation simplicity and maintainability
4. Prefer the standard library over implementing it yourself

### 3. Analyze Complexity

> Goal: analyze before implementing

1. Compute best/average/worst time complexity
2. Compute space complexity
3. Identify bottlenecks
4. Run `/deep-review` per [`deep-review/SKILL.md`](`deep-review/SKILL.md`) if a detailed check is needed

### 4. Implement

> Goal: write the algorithm correctly and readably

1. Use meaningful variable and function names
2. Split into helper functions if complex
3. Add comments for tricky parts
4. Cover edge cases with unit tests

### 5. Optimize If Needed

> Goal: improve when necessary

1. Profile before optimizing
2. Weigh the trade-off between time and space
3. Avoid premature optimization
4. Document why the optimization was made

## Rules

### 1. Prefer Standard Libraries

- Use built-in sort, search, and collections before implementing your own
- Use well-known libraries when available in the ecosystem
- Implement it yourself only when truly necessary

### 2. Document Complexity

- State time/space complexity in comments or docs
- Explain why this algorithm was chosen
- Note the worst case

### 3. Test Edge Cases

- Test with empty input, large sizes, and special orderings
- Test the worst case when feasible
- Use property-based tests where appropriate

- Use /follow-math-concepts if needed

## Expected Outcome

- The chosen algorithm fits the problem
- The implementation is correct and tested
- Complexity is analyzed and documented
- No over-engineering
