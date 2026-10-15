# Proofs

## Goal

Understand proof techniques: direct proof, proof by contradiction, contrapositive, mathematical induction, strong induction, and their application to verifying correctness, invariants, and algorithms

## Scope

- Use for verifying invariants, loop correctness, algorithm correctness
- Covers direct, contradiction, contrapositive, induction
- Applied in formal reasoning and prompts

## Execute

### 1. Choose Proof Technique

> Goal: pick the suitable method

1. Direct proof: conclude from assumptions to conclusion directly
2. Contradiction: assume the conclusion is false, show a contradiction arises
3. Contrapositive: prove `¬Q → ¬P` instead of `P → Q`
4. Induction: for statements over natural numbers/structures

### 2. Proof By Induction

> Goal: prove for every n

1. Base case: prove P(0) or P(1)
2. Inductive hypothesis: assume P(k)
3. Inductive step: show P(k) → P(k+1)
4. Conclude P(n) for all n
5. Strong induction: assume P(0)...P(k), then show P(k+1)

### 3. Loop Invariants

> Goal: check the correctness of a loop

1. Identify the invariant: a condition true before the loop, every iteration, and after the loop
2. Initialization: the invariant holds before the loop
3. Maintenance: if the invariant holds before an iteration, it holds after the iteration
4. Termination: when the loop ends, the invariant yields the desired property

### 4. Contradiction In Code

> Goal: use contradiction in debugging

1. Assume the suspected cause of the bug is wrong
2. Show that if that assumption were true, a contradiction would occur
3. Conclude the cause must be right
4. Use with unit tests that break an assumption

### 5. Map To Code

> Goal: apply in software

1. Prove an algorithm is correct (binary search, sorting)
2. Check loop invariants before refactoring
3. Use induction to prove a recursive function
4. Use proofs in formal verification / prompts

## Rules

### 1. Base Case Matters

- Check the base case in induction
- Beware off-by-one
- Test the base case with code/tests

### 2. Clear Assumptions

- State the assumptions clearly
- Never use a theorem's conclusion before proving it
- Separate given from to-prove

### 3. Code Mapping

- invariants = assertions before/inside/after the loop
- Use property-based testing to confirm invariants
- Use formal methods when needed

- Use /follow-math-concepts if needed
- Use /follow-test if needed
- Use the TDD loop in `implement-to-production/SKILL.md` `## TDD Loop` if needed
- Use /follow-deterministic if needed

## Expected Outcome

- Able to choose the suitable proof technique
- Able to use induction on natural numbers and data structures
- Able to check loop invariants
- Able to use proofs in code correctness
