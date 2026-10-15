# TSTyche — Best Practices

Type-testing discipline — precision over suppression, one owner per assertion, version ranges in CI only

## Recommended Patterns

- Name type-test files `*.tst.ts` (or keep them in `typetests/`) — runtime runners (`vitest`, `bun test`) must never collect them; one owner per file type
- Test the public type contract, not internals: pin what `/check-types-definition` reports as the API surface — return types, callable/constructable/instantiable signatures, accepted props
- Pair assertions: one positive + one negated (`.not`) differing in exactly one element — the reader sees precisely what is rejected
- Keep the type under test on the left: `expect(value).type.toBeAssignableTo<Set<string>>()` reads better than the reverse `toBeAssignableFrom` form
- Use `// @tstyche if { target: "..." }` where TypeScript versions legitimately differ (e.g. `Uint8Array` became generic in 5.7) instead of skipping whole tests
- Use `// @tstyche fixme -- issue link` for known-broken types — it converts "expected failure" into a real regression signal
- In CI: `tstyche --fetch` first (warm the shared store), then `--target '>=x.y'` matching the manifest's declared support; add `"test:types": "tstyche"` so `/run-test`/CI treat it as a layer
- Daily/scheduled job against `--target next` gives early warning of breaking type changes before a TypeScript minor release lands

## Common Pitfalls

- The `@ts-expect-error` trap: bare directives pass on any error (lost import, renamed symbol) — misleading green tests; use negated ability matchers, and only `@ts-expect-error <message>` when the message itself is the contract (verified via `checkSuppressedErrors`)
- `.toRaiseError()` is deprecated — rewrite to `.not.toBeCallableWith(...)`-style ability matchers
- Forgetting that code never runs: type-test bodies are static scope — no mocks, no runtime fixtures, assertions about values must be about their types
- Testing `any`/`never` accidentally accepted: defaults `rejectAnyType`/`rejectNeverType` catch accidental widening — don't disable them to make a suite green
- Running full version ranges locally — every minor re-checks the whole program; iterate with one `--target 5.8.2`, keep ranges for CI
- Duplicating assertions in both vitest `typecheck`/`expect-type` and tstyche — pick one owner per project (single source of truth); tstyche wins when multi-version targeting matters
- Stale pins in docs/config: TS support floor and TS7 behavior change per release — re-check via `/deep-research` before adjusting `target`

## Do / Don't

| Do | Don't |
|----|-------|
| negated ability matcher for invalid input | bare `@ts-expect-error` as the test |
| `*.tst.ts` outside runtime globs | type tests collected by vitest and tstyche alike |
| positive + negated pair, one element apart | lone `.not` assertions with unclear intent |
| `@tstyche if` per version-diverging assertion | version-specific hacks or whole-test skips |
| ranges + `--fetch` in CI only | `--target '>=5.4'` loops on a dev laptop |
| `_` placeholder + `toBeInstantiableWith<[T]>` | hand-writing unreachable generic wrappers to probe constraints |
