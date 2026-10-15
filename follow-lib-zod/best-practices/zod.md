# Zod — Best Practices

Schema-first validation — inference, error handling, and perf discipline

## Recommended Patterns

- Schema = source of truth: `z.infer<typeof schema>` for TS types — never write a separate interface
- `safeParse` at the boundary — return `{success, data, error}` without throwing; use `parse` only for true invariants (throw = bug signal)
- Compose: `.extend`, `.merge`, `.pick`, `.omit`, `.partial` — derive schemas instead of duplicating
- `.transform`/`.refine`/`.superRefine` — transform when the shape changes, refine for cross-field/custom logic
- `z.discriminatedUnion` for variants — faster than `z.union` with better error messages
- Error surfacing: `error.issues`/`z.treeifyError`/`z.flattenError` — format for UI use, don't pass raw messages

## Common Pitfalls

- `.default()` vs `.optional()` — default fills a value when undefined, optional just allows undefined; the output types differ
- `.passthrough()`/`.loose()` (zod4: `z.looseObject`) let unknown keys through — strict is better by default security-wise; prefer `.catchall` if extras must be validated
- Transforms make output ≠ input — check `z.infer` vs `z.input`/`z.output` to use the right side
- Async refinements → require `safeParseAsync`/`parseAsync` — sync parse throws
- Recursion: `z.lazy()` + an explicit type annotation — TS can't infer recursive schemas

## Perf Notes

- Schemas compile at creation — hoist them to module-level consts, never build them inside a request handler
- Large `z.union` is slow — use a discriminated union when a discriminant key exists
- `z.object` checks all keys — for schemas validated heavily repeatedly, consider caching the parsed result

## Do / Don't

| Do | Don't |
|----|-------|
| `safeParse` at boundaries | `parse` everywhere wrapped in try/catch |
| `discriminatedUnion` for variants | long `z.union` chains |
| derive schemas (`.pick`/`.omit`) | duplicate schema definitions |
| hoist schema module-level | construct schemas in the hot path |
