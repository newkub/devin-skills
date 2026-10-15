# fast-check — Best Practices

Property-based testing — arbitraries, invariants and shrink discipline

## Recommended Patterns

- Write properties that are real invariants — `fc.assert(fc.property(arb, (x) => pred(x)))` — not just "doesn't throw"
- Pick arbitraries to cover the edge space: `fc.integer()`, `fc.string()`, `fc.array()`, `fc.record()` + compose with `fc.tuple`/`fc.oneof`/`fc.constantFrom`
- Use `fc.pre(condition)` when inputs must be filtered — don't generate and discard a lot (skew distribution)
- `fc.asyncProperty` for async code — don't wrap async in a sync property
- Reproduce failures with the `seed` + `path` that fast-check prints — log them in CI artifacts

## Common Pitfalls

- Properties must be pure — side effects in a property → non-deterministic shrinks
- Shrinking is the strength — if a custom arbitrary doesn't shrink (built via heavy `.map`), use `.filter`+`fc.base64String` etc. or `fc.constant` bounds
- `fc.date()`/`fc.object()` defaults are very wide — constrain ranges (`min`, `max`, `size`) to match the domain
- Don't create arbitraries inside the test loop — hoist to a single const
- `numRuns` default 100 is enough for smoke; CI regression raise to 1000+ for critical invariants

## Integration

- Write a property spec when a function has invariants (roundtrip, idempotent, ordering, bounds) — not for every function
- Use alongside unit tests — example-based for known cases + property for edge coverage
- Failure output gives a minimal counterexample — copy it into the test suite as a regression example

## Do / Don't

| Do | Don't |
|----|-------|
| invariants (roundtrip, idempotent, sorted) | properties asserting trivial things (`x === x`) |
| `fc.pre` / constrained arbitraries | rejecting 90% of inputs |
| seed+path reproduction | ignoring failure logs |
| composed arbitraries (`oneof`, `tuple`) | generating by hand with Math.random |
