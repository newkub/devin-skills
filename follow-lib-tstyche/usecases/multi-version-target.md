# Use Case — Verify Types Across a TypeScript Range

> Prove the package's types work on every TypeScript version it claims to support. Source: https://tstyche.org (accessed 2026-10-20)

## 1. Start from the declared support range

Read the range the package actually publishes — `peerDependencies.typescript` or the docs. The CI target must equal that range, not a number copied from another project.

```bash
bunx tstyche --list        # TypeScript versions tstyche can target
```

## 2. Warm the store before the range run

```bash
bunx tstyche --fetch
bunx tstyche --target '>=5.6'
```

`--fetch` pre-downloads the versions in the target set; CI without it spends its first run on the network. `'>=5.6'` tests every minor from 5.6 up, which is the point of a declared floor.

## 3. Combine and bound the target set

| Intent | Target |
|--------|--------|
| floor and above | `'>=5.6'` |
| specific versions | `'5.6 || 5.8.2 || latest'` |
| bounded window | `'>=5.4 <5.6'` |

`||` unions, spaces intersect. A range that silently includes a version you never test is the same as no guarantee.

## 4. Gate the assertions that legitimately differ

```ts
// @tstyche if { target: ">=5.7" }
test("infers the const type parameter", () => {
  expect(parse("x")).type.toBe<"x">();
});
```

Some inference improves in a later compiler. Gate those assertions instead of lowering the whole suite to the weakest version. Place the same comment at the top of the file to gate the file.

## 5. Mark known failures as required failures

```ts
// @tstyche fixme -- inference regressed in 5.6, fixed upstream in 5.7
test("narrows the union", () => {
  expect(narrow(value)).type.toBe<Leaf>();
});
```

`fixme` inverts the expectation: the assertion must fail. When the compiler is fixed, the suite fails and tells you to remove the marker — that is the regression alarm.

## 6. Keep local runs cheap and CI runs wide

1. Locally: plain `bunx tstyche` against the installed TypeScript, iterating on one version
2. In CI: `tstyche --fetch` then `tstyche --target '<declared range>'`
3. Optionally schedule a nightly run against `typescript@next` to see breakage before a release
4. Adjust the cache location with `TSTYCHE_STORE_PATH` when CI has no persistent home directory
5. `/run-check` and `/run-test` still pass; the wide run must not leak into the default config

## Pitfalls

- Committing `"target": "*"` and assuming it covers the floor — `*` follows the locally installed TypeScript only.
- Running the full range on every save, which makes the suite slow enough that people stop running it.
- `--update` in CI, which refreshes registry metadata on the fly and makes a green build non-reproducible.
- Using `latest` as the default target, so the suite tests a version users do not have.

## Related

- `references/cli.md`
- `references/apis.md`
- `best-practices/tstyche.md`
- `usecases/type-test-public-api.md`
