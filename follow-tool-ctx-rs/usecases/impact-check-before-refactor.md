# Use Case — Check Impact Before Refactoring Shared Code

> Find the callers and dependents of a symbol before changing it, and keep potential impact separate from runtime proof. Source: https://www.ctx.rs/docs/cli-reference (accessed 2026-10-22)

## 1. Confirm a graph snapshot exists

```bash
ctx graph stats
```

No snapshot, or a stale one, means graph answers describe an older revision — refresh before trusting them:

```bash
ctx graph index .
ctx graph update
```

## 2. Resolve the symbol

```bash
ctx graph search calculateTax
```

Pick the exact symbol and file. Ambiguous names return several candidates; do not merge their impact sets.

## 3. Find direct and transitive dependents

```bash
ctx graph callers calculateTax
ctx graph impact calculateTax
```

`callers` lists direct call sites; `impact` follows the relationship graph. Both are bounded — report truncation and unresolved references instead of implying completeness.

## 4. Combine with git and history evidence

```bash
ctx blame file src/tax/calculate.ts --format json
ctx search "calculateTax refactor"
```

Blame shows which sessions produced the current implementation; search shows what earlier sessions decided about it. Neither proves runtime behavior.

## 5. Decide and state limits

- direct callers found
- broader impact found or truncated
- prior sessions that discussed the change
- unknowns: dynamic dispatch, reflection, unresolved imports
- confirmation method: type check, tests, or runtime check planned

## Pitfalls

- Treating `graph impact` as proof of every runtime path — dynamic calls and unresolved imports are invisible to it.
- Skipping `ctx graph update` after edits — results describe the last indexed revision.
- Using graph evidence as history attribution — a caller relationship says nothing about who wrote the code.
- Refactoring before checking whether the working tree already has uncommitted edits.
- Ignoring truncation markers in graph output and reporting an exhaustive list.

## Related

- `references/cli.md`
- `best-practices/evidence-discipline.md`
- `best-practices/history-vs-code-search.md`
- `usecases/attribute-lines-to-session.md`
