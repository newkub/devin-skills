# Propositional Logic

## Goal

Understand propositional logic: propositions, truth values, logical operators, truth tables, tautology, contradiction, logical equivalences, and their application in programming, debugging, and prompts

## Scope

- Use for analyzing boolean conditions, if/else, assertions, feature flags
- Covers operators: NOT, AND, OR, XOR, IMPLIES, IFF
- Covers truth tables, tautology, contradiction, contingency
- Recommends De Morgan's laws, distributive, associative, commutative laws
- Does not go deep on quantifiers (see `/follow-math-concepts`)

## Execute

### 1. Define Propositions

> Goal: identify propositions from the problem

1. Identify statements that have a truth value (true/false)
2. Name variables, e.g. `P = "user is logged in"`, `Q = "cart is not empty"`
3. Separate atomic propositions from compound propositions
4. Identify the operators used

### 2. Build Truth Tables

> Goal: compute truth values of compound propositions

1. Create columns for every atomic proposition
2. Create columns for every sub-expression
3. Compute truth values layer by layer
4. Use the symbols:
   - `¬P` or `!P` for NOT
   - `P ∧ Q` or `P && Q` for AND
   - `P ∨ Q` or `P || Q` for OR
   - `P → Q` for implication
   - `P ↔ Q` for equivalence

### 3. Identify Tautology Contradiction And Contingency

> Goal: find tautologies, contradictions, and contingencies

1. If every value in the final column is true → tautology
2. If every value is false → contradiction
3. If there are both true and false → contingency
4. Record the result with an example

### 4. Apply Logical Equivalences

> Goal: simplify the expression

1. Use De Morgan's laws:
   - `¬(P ∧ Q) ≡ ¬P ∨ ¬Q`
   - `¬(P ∨ Q) ≡ ¬P ∧ ¬Q`
2. Use distributive, associative, commutative laws
3. Use double negation: `¬¬P ≡ P`
4. Use implication: `P → Q ≡ ¬P ∨ Q`
5. Use equivalence: `P ↔ Q ≡ (P → Q) ∧ (Q → P)`

### 5. Map To Programming

> Goal: apply it in code

1. Translate logical expressions into if/else, while, guard clauses
2. Express them as boolean algebra in code
3. Use simplification to reduce nested conditions
4. Verify assertions with a truth table
5. Check whether a condition is a tautology or dead code

### 6. Map To Prompts And Debugging

> Goal: use logic in prompts and debugging

1. In prompts: state conditions explicitly with AND/OR/NOT
2. In debugging: build a truth table of the branches that occur
3. Find edge cases from combinations of boolean variables
4. Pinpoint the bug's cause from a logical contradiction

## Rules

### 1. Truth Values Only

- Variables must hold only true/false
- No quantifiers in this topic (use `/follow-math-concepts`)
- Never confuse implication with causation

### 2. Operator Precedence

- NOT is highest
- AND comes next
- OR is lower than AND
- Use parentheses for clarity

### 3. Common Fallacies

- Affirming the consequent: `P → Q, Q ∴ P` is invalid
- Denying the antecedent: `P → Q, ¬P ∴ ¬Q` is invalid
- Verify the inference rule is valid before using it

### 4. Programming Mapping

- `&&` = AND, `||` = OR, `!` = NOT
- `a ? b : c` is the conditional/ternary
- `==` is not always logical equivalence — be careful

- Use /follow-math-concepts if needed
- Use /deep-debug if needed
- Use /ask-me if needed

## Expected Outcome

- Able to build a truth table from propositions
- Able to identify tautology, contradiction, contingency
- Able to simplify boolean expressions
- Able to map them to if/else, assertions, feature flags
- Able to use logic in prompts and debugging
