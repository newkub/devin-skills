# Use Case — Scan A Monorepo Without Drowning In Noise

> In a monorepo the interesting duplication is the copy a second workspace makes of the first one's helper; local duplication inside one package is a different, cheaper problem. Sources: https://github.com/kucherenko/jscpd and `jscpd --help` (accessed 2026-10-21)

## 1. Decide root scan or per-workspace scan

```sh
bunx jscpd . --reporters console,json --output report
bunx jscpd ./apps/web/src ./apps/admin/src --reporters console,json
```

A root scan sees clones that cross workspace boundaries. Per-workspace runs cannot: each run only knows its own files, so a helper copy-pasted from `packages/core` into `apps/web` is invisible in both runs.

## 2. Report only cross-workspace clones

```sh
bunx jscpd . --skip-local --reporters console,json
```

`--skip-local` filters out clones whose two sides live in the same folder, leaving the ones that argue for a shared package. Run it alongside the normal scan rather than replacing it — "this file clones itself twice" and "two packages clone each other" need different fixes.

## 3. Exclude folders owned by other teams

```sh
bunx jscpd . --skip-isolated "packages/legacy-a|packages/legacy-b"
```

`--skip-isolated` drops clones that are contained inside the listed folders, so a workspace you are not allowed to touch stops polluting the number you are asked to reduce.

## 4. Catch clones that crossed the language boundary

```sh
bunx jscpd . --cross-formats "javascript,typescript"
```

A duplicated block that was ported from JS to TS is still a duplicate, and the default per-language comparison will not pair the two files. Without this, a migration looks like progress.

## 5. Find where the mass is

```sh
bunx jscpd . --summary
```

`--summary` prints the folders and files carrying the most tokens and complexity — a better starting point than the clone list, because one 2,000-line generated file can outweigh fifty real clones.

## 6. See whether it is getting better or worse

```sh
bunx jscpd . --history v1.0.0..HEAD
```

`--history` reports duplication across a commit range. Use it when a merge of several branches left you unsure whether the score moved because of the merge or because of the work inside it.

## 7. Verify

1. Run the root scan and the per-workspace scan, then explain every difference between the two numbers
2. Confirm `--skip-local` output is a subset of the root scan output
3. Check the summary's top files are hand-written source, not generated code — if not, fix the ignore list first
4. Rank the remaining clones by how many workspaces share them, highest first
5. Hand each cross-workspace clone to `/refactor` as "extract into a shared package"

## Pitfalls

- Summing per-workspace scores and calling the total "the monorepo score" — each run's denominator is different.
- Adding `packages/shared` to `ignore` because it "clones everything" — that folder is usually the fix, not the problem.
- Using `--skip-local` as the only gate, so local duplication grows unchecked.
- Ignoring only `node_modules`, letting each workspace's build output into the scan.
- A root `.jscpd.json` silently overriding what you thought were CLI flags — re-run with `--verbose` when a file you excluded still appears in the report.
- Comparing a JS-only scan with a JS+TS scan and reading the jump as a regression.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/jscpd.md`
- `usecases/ci-duplication-gate.md`
