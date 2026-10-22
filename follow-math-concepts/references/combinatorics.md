# Combinatorics

## Goal

Use combinatorics to count ways, build test cases, analyze brute-force bounds, and handle permutations/combinations in code

## Scope

- Use for counting, permutations, combinations, the pigeonhole principle
- Covers factorial, binomial coefficients, product rule, sum rule
- Applied in test data generation, search space, subsets

## Execute

### 1. Identify Counting Problem

> Goal: know what to count

1. Identify the objects and their count
2. Decide whether order matters
3. Decide whether repetition is allowed
4. Pick the fitting formula

### 2. Apply Formulas

> Goal: compute the count

1. Permutations without repetition: `n!`
2. Permutations with repetition: `n^k`
3. Combinations without repetition: `C(n, k) = n! / (k!(n-k)!)`
4. Combinations with repetition: `C(n+k-1, k)`
5. Product rule: do A then B = `|A| * |B|`
6. Sum rule: A or B = `|A| + |B|`

### 3. Use Pigeonhole Principle

> Goal: find the guarantee / bound

1. If `n` items go into `m` bins and `n > m`, some bin must hold at least 2 items
2. Use it to check that a test must contain a duplicate
3. Use it to find minimum collisions in hashing

### 4. Map To Code

> Goal: apply it in code

1. Generate test cases covering combinations of inputs
2. Compute the brute-force search space size
3. Use backtracking for permutations/combinations
4. Use binomial coefficients in dynamic programming

## Rules

### 1. Problem Classification

- Order matters → permutation
- Order doesn't matter → combination
- Reusable picks → with repetition
- No reuse → without repetition

### 2. Avoid Overflow

- Use `BigInt` or modular arithmetic for large numbers
- Use the multiplicative formula of `C(n,k)` instead of raw factorial

### 3. Practical Mapping

- `Array.prototype.permutation` can be built with recursion
- Use a bitmask for subsets/combinations when `n` is small
- Use a library when `n` is large

- Use /follow-math-concepts if needed
- Use /deep-test if needed

## Expected Outcome

- Able to pick the right counting formula
- Able to build test cases from combinations/permutations
- Able to estimate search space size
- Able to use the pigeonhole principle in debugging
