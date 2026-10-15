# Boolean Algebra

## Goal

Understand boolean algebra: reduce/simplify boolean expressions using De Morgan, distributive, absorption, and Karnaugh maps to cut condition complexity

## Scope

- Use with if/else, guard clauses, assertions, feature flags
- Covers AND, OR, NOT, XOR, NAND, NOR, XNOR
- Uses the laws: identity, null, idempotent, inverse, commutative, associative, distributive, absorption, De Morgan
- Recommends the Karnaugh map for 2-4 variables

## Execute

### 1. Parse Expression

> Goal: convert the expression to canonical form

1. Identify the variables, e.g. `A`, `B`, `C`
2. Identify the operators used: `&&`, `||`, `!`, `^`
3. Build a truth table if needed
4. Convert to minterms or maxterms

### 2. Apply Boolean Laws

> Goal: reduce the expression

1. Use De Morgan: `!(A && B) = !A || !B`, `!(A || B) = !A && !B`
2. Use absorption: `A || (A && B) = A`, `A && (A || B) = A`
3. Use distributive: `A && (B || C) = (A && B) || (A && C)`
4. Remove double negation: `!!A = A`
5. Use the consensus theorem: `(A && B) || (!A && C) || (B && C) = (A && B) || (!A && C)`

### 3. Karnaugh Map Simplification

> Goal: find the minimal expression

1. Draw the K-map per the number of variables
2. Fill in the 1s from the truth table
3. Group the 1s into groups of 2, 4, 8
4. Read each group's product term
5. OR all the terms

### 4. Map To Code

> Goal: convert to code

1. Convert `A || (!A && B)` → `A || B`
2. Convert `if (cond1 && cond2) || (cond1 && !cond2)` → `if (cond1)`
3. Use guard clauses instead of nested ifs
4. Use boolean algebra to detect dead code

## Rules

### 1. Operator Precedence

- `!` > `&&` > `||` > `^`
- Use parentheses for clarity

### 2. Laws

- Don't forget De Morgan when negating AND/OR
- Check absorption before splitting
- Use a K-map from 4 variables up

### 3. Code Mapping

- `&&` = AND, `||` = OR, `!` = NOT, `^` = XOR
- The ternary `? :` is a multiplexer
- Never over-simplify until the code is unreadable

- Use /follow-math-concepts if needed
- Use /deep-debug if needed
- Use /follow-software-engineering if needed

## Expected Outcome

- Able to reduce a boolean expression to minimal form
- Able to use a K-map for 2-4 variables
- Able to map to if/else / guard clauses
- Able to detect dead code / tautologies in conditions
