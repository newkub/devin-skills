# Algorithm Complexity

## Goal

Understand algorithm complexity: Big O, Omega, Theta, recurrence relations, Master theorem, and applying the analysis to code

## Scope

- Use for analyzing time and space complexity
- Covers best/average/worst case, asymptotic notation
- Applied in loops, recursion, nested data structures

## Execute

### 1. Analyze Iterative Code

> Goal: find the complexity of loops

1. Count operations against input size `n`
2. For nested loops, multiply each level's complexity
3. Drop constant factors
4. Keep the fastest-growing term
5. Example: 2-level nested `for` = `O(n^2)`

### 2. Analyze Recursive Code

> Goal: find the recurrence

1. Write the recurrence: `T(n) = aT(n/b) + f(n)`
2. Use the Master theorem:
   - case 1: `f(n) < n^log_b(a)` → `O(n^log_b(a))`
   - case 2: `f(n) = n^log_b(a)` → `O(n^log_b(a) log n)`
   - case 3: `f(n) > n^log_b(a)` → `O(f(n))`
3. Use a recursion tree when the Master theorem doesn't fit

### 3. Compare Complexities

> Goal: pick the better algorithm

1. Order them: `O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)`
2. Look at constants when `n` is small
3. Consider space complexity as well
4. Watch hidden costs like cache, allocations

### 4. Space Complexity

> Goal: analyze memory

1. Count the stack depth for recursion
2. Count auxiliary data structures
3. Separate in-place from extra space
4. Beware exponential space from backtracking

### 5. Map To Code

> Goal: apply it in code improvement

1. Find the bottleneck in nested loops
2. Pick data structures by operation complexity
3. Cut recursion depth when stack overflow is a risk
4. Use benchmarks to confirm the theoretical analysis

## Rules

### 1. Asymptotic Notation

- Big O = upper bound
- Omega = lower bound
- Theta = tight bound
- Don't use O when Theta is meant

### 2. Input Definition

- State what `n` is: length, size, nodes, etc.
- Separate best/average/worst case
- Don't keep lower-order terms

### 3. Code Mapping

- `Array.sort()` is typically `O(n log n)`
- `Map.get()` is `O(1)` average
- Nested `filter` + `map` can be `O(n^2)` if careless
- Recursion with many branches can be exponential

- Use /deep-review if needed
- Use /deep-test if needed
- Use /follow-math-concepts if needed

## Expected Outcome

- Able to analyze time/space complexity
- Able to use the Master theorem
- Able to compare algorithms
- Able to identify bottlenecks in code
