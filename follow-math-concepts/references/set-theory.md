# Set Theory

## Goal

Understand set theory: sets, elements, operations, Venn diagrams, power sets, and cartesian products, and apply them in programming, data filtering, and prompts

## Scope

- Use for analyzing collections, unique values, filters, joins
- Covers set operations: union, intersection, difference, complement
- Covers subsets, power sets, cartesian products
- Does not go deep into axiomatic set theory

## Execute

### 1. Define Sets

> Goal: identify the sets and members

1. Identify set A, B, universe U
2. Identify elements: `x ∈ A`, `x ∉ A`
3. Use roster notation `{1, 2, 3}` or set-builder `{x | P(x)}`
4. Identify the empty set `∅` and singletons

### 2. Visualize With Venn Diagram

> Goal: understand the relationships

1. Draw circles for A, B inside U
2. Identify intersection `A ∩ B`, union `A ∪ B`
3. Identify difference `A \ B`, complement `A'`
4. Use it to check logical equivalences

### 3. Apply Set Operations

> Goal: compute the operations

1. Union: `A ∪ B = {x | x ∈ A or x ∈ B}`
2. Intersection: `A ∩ B = {x | x ∈ A and x ∈ B}`
3. Difference: `A \ B = {x | x ∈ A but x ∉ B}`
4. Complement: `A' = {x | x ∈ U but x ∉ A}`
5. Symmetric difference: `A Δ B = (A \ B) ∪ (B \ A)`

### 4. Use Set Relations

> Goal: compare sets

1. Subset: `A ⊆ B` — every element of A is in B
2. Proper subset: `A ⊂ B`
3. Equality: `A = B` when `A ⊆ B` and `B ⊆ A`
4. Disjoint: `A ∩ B = ∅`

### 5. Advanced Notions

> Goal: use power set and cartesian product

1. Power set: `P(A) = {S | S ⊆ A}`
2. Cartesian product: `A × B = {(a, b) | a ∈ A, b ∈ B}`
3. Used in database joins, tuple types
4. State the cardinality of a set

### 6. Map To Programming

> Goal: apply it in code

1. Use Set in JavaScript/TypeScript/Bun: `new Set()`
2. Use filter/map/reduce for set operations
3. Use SQL `UNION`, `INTERSECT`, `EXCEPT`
4. Check duplicates, unique values, membership
5. In prompts: state groups, exclusions, inclusions

## Rules

### 1. Universe First

- Always state the universe U
- Complement must reference U
- Don't forget the empty set `∅`

### 2. Operation Equivalences

- `A ∪ B` corresponds to `A || B` when viewed as membership
- `A ∩ B` corresponds to `A && B`
- `A'` corresponds to `!A`
- Use De Morgan's laws for complements

### 3. Practical Mapping

- Sets = collections of unique values
- Subset = filter conditions
- Union/Intersection = combine datasets
- Difference = exclude

- Use /follow-math-concepts if needed
- Use /deep-debug if needed

## Expected Outcome

- Able to draw a Venn diagram and compute the operations
- Able to map to code and SQL
- Able to use set relations in prompts
