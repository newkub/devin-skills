# review-quality — Full Dimension Checklist

## 1. Code Quality

- [ ] functions ≤50 lines, nesting ≤3, complexity ≤10
- [ ] files ≤300 lines, single responsibility per unit
- [ ] dead code, unused exports (knip), duplication (jscpd)

## 2. Naming And Consistency

- [ ] naming conventions uniform, intent-revealing
- [ ] formatting consistent, idiomatic patterns
- [ ] comments: why not what, no stale comments

## 3. Bug-Prone Patterns

- [ ] mutable shared state, hidden side effects
- [ ] swallowed errors, empty catches, unsafe casts
- [ ] magic numbers/strings, unclear conditionals

## 4. Correctness

- [ ] edge cases handled, null safety, boundary conditions
- [ ] error handling complete + actionable messages
- [ ] contract adherence, invariant preservation

## 5. Simplicity

- [ ] over-engineering, premature abstraction
- [ ] unnecessary indirection, config sprawl
- [ ] simpler alternatives flagged

## 6. Maintainability

- [ ] testability: pure logic separable, DI where needed
- [ ] readability for next developer (`/review-writing`)
- [ ] documentation where non-obvious

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
