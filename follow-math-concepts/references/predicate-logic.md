# Predicate Logic

## Goal

Understand predicate logic (first-order logic): predicates, quantifiers, domains, set theory, inference rules, and their application in programming, debugging, database queries, and prompts

## Scope

- Use for analyzing statements with quantifiers: all, some, none, exactly one
- Covers sets, membership, subset, union, intersection, complement
- Covers predicates and quantifiers: ∀ (forall), ∃ (exists), ∃! (exists unique)
- Recommends inference rules and valid/invalid arguments
- Does not go deep on basic propositional operators (see `/follow-math-concepts`)

## Execute

### 1. Define Predicates And Domain

> Goal: identify the predicates and the domain

1. Identify the domain of discourse, e.g. users, orders, posts
2. Create predicates like `P(x)`, e.g. `IsLoggedIn(x)`, `HasItem(x, y)`
3. Separate constants, variables, and predicates
4. Identify n-ary predicates if present, e.g. `GreaterThan(x, y)`

### 2. Use Quantifiers

> Goal: translate natural language into predicate logic

1. `∀x P(x)` — every x has property P (all)
2. `∃x P(x)` — some x has property P (some/exists)
3. `∃!x P(x)` — exactly one x (exists unique)
4. `¬∃x P(x)` ≡ `∀x ¬P(x)` — no x at all (none)
5. `¬∀x P(x)` ≡ `∃x ¬P(x)` — not every x (not all)
6. Translate natural-language sentences:
   - "every user must have an email" → `∀u (User(u) → HasEmail(u))`
   - "some users are admins" → `∃u (User(u) ∧ Admin(u))`

### 3. Work With Sets

> Goal: apply set theory

1. Identify the sets: A, B, C, universe U
2. Use the operations:
   - union `A ∪ B` — members in A or B
   - intersection `A ∩ B` — members in A and B
   - complement `A'` or `U \ A` — members not in A
   - difference `A \ B` — members in A but not in B
3. Use Venn diagrams to visualize
4. Identify subset, proper subset, and equality
5. Convert a predicate into set comprehension when suitable

### 4. Negate Quantified Statements

> Goal: find the correct negation

1. `¬∀x P(x)` ≡ `∃x ¬P(x)`
2. `¬∃x P(x)` ≡ `∀x ¬P(x)`
3. Apply to multiple quantifiers right to left:
   - `¬∀x ∃y P(x, y)` ≡ `∃x ∀y ¬P(x, y)`
4. Verify the negation is correct

### 5. Apply Inference Rules

> Goal: reason correctly

1. Universal instantiation: from `∀x P(x)` conclude `P(c)`
2. Universal generalization: from `P(c)` for an arbitrary c conclude `∀x P(x)`
3. Existential instantiation: from `∃x P(x)` conclude `P(c)` for some c (new constant)
4. Existential generalization: from `P(c)` conclude `∃x P(x)`
5. Check the argument's validity before using it

### 6. Map To Programming And Prompts

> Goal: apply it in code and prompts

1. In programming:
   - `every` / `some` array methods
   - SQL `EXISTS`, `ALL`, `SOME/ANY`
   - type constraints: `forall` in generics/dependent types
   - loop invariants expressed with quantifiers
2. In databases:
   - `WHERE EXISTS (SELECT ...)`
   - `GROUP BY ... HAVING` with aggregate conditions
3. In prompts:
   - state constraints with "for all", "there exists", "none"
   - check edge cases with quantifiers
4. In debugging:
   - find a counterexample of `∀x P(x)`
   - find an example satisfying `∃x P(x)`

## Rules

### 1. Domain First

- Specify the domain before using a quantifier
- Variables must come from the domain
- Never use quantifiers with predicates that have no stated domain

### 2. Implication And Conjunction With Quantifiers

- `∀x (A(x) → B(x))` matches "all A are B"
- `∃x (A(x) ∧ B(x))` matches "some A are B"
- Don't accidentally swap implication and conjunction

### 3. Negation Rules

- Swap ∀ and ∃ when negating
- Keep the predicate after the negation
- Work right to left with multiple quantifiers

### 4. Set And Predicate Link

- `x ∈ A` can be written as the predicate `A(x)`
- Set operations correspond to logical operators
- Use Venn diagrams to verify correctness

- Use /follow-math-concepts if needed
- Use /deep-debug if needed
- Use /ask-me if needed

## Expected Outcome

- Able to translate natural-language sentences into predicate logic
- Able to negate quantifiers
- Able to use set operations and Venn diagrams
- Able to reason with inference rules
- Able to map to programming, SQL, and prompts
