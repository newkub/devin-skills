# Use Case — Fail The Build On A New Circular Import

> Circular imports rarely break a build, so they arrive quietly and stay; the useful gate is an exit code, not a report nobody reads. Sources: https://github.com/pahen/madge and `madge --help` (accessed 2026-10-21)

## 1. Look at the cycles before automating anything

```sh
bunx madge --circular --extensions ts,tsx --ts-config tsconfig.json src/
```

Without `--ts-config` every path alias (`~/*`, `@/*`) is an unresolved path, which inflates the orphan list and can hide the real cycle. Without `--extensions` madge parses the extensions it knows, not the ones the project uses.

## 2. Scope the scan so it finishes

```sh
bunx madge --circular --extensions ts,tsx src/
bunx madge --circular --exclude '\.(test|spec)\.(ts|tsx)$' --extensions ts,tsx src/
```

On a large repo the whole graph is slow and mostly noise. Scan the directory you own; run the other directories in their own jobs. Excluding tests is a decision, not a default — a cycle that only exists through a test file is still real, so exclude it only after checking.

## 3. Make the failure explicit

```sh
bunx madge --circular --exit-code 1 --extensions ts,tsx src/
```

madge exits 0 even when it finds cycles. `--exit-code 1` is the whole gate — without it the CI job is a log line.

## 4. Count cycles over time

```sh
bunx madge --circular --json --extensions ts,tsx src/ > report/cycles.json
node -e "const g=require('./report/cycles.json');console.log(g.length)"
```

The JSON is an array of cycles. Recording the length per commit turns "are we getting better" into a number, and lets you ratchet the limit down instead of holding at zero from day one.

## 5. Put it where people run it

```sh
hk check
```

A hook that runs the same command catches the cycle at commit time, when the import was just written. In a moonrepo, the same command belongs in a task gated by `vcs.hooks`; the point is one command, run by both the hook and CI.

## 6. Verify

1. Run the gate on `main` — it must exit 0
2. Add a temporary two-file cycle and run it again — it must exit non-zero and name both files
3. Remove the temporary cycle and confirm the exit code returns to 0
4. Run `/run-verify` after any fix, because breaking a cycle by moving a module touches imports across the graph

## Pitfalls

- Omitting `--exit-code`, so CI reports cycles and passes.
- Reporting a cycle without fixing the direction — a cycle broken by a lazy `import()` inside a function is hidden, not removed.
- Missing `--ts-config`, producing unresolved-path noise that looks like new orphans.
- Barrel files: an `index.ts` that re-exports a folder creates a cycle through itself; check barrels first when the listed files look unrelated.
- `import(variable)` is not traced, so the graph is incomplete by construction — do not read "no cycles" as proof.
- Scanning the whole monorepo in every workspace job, which multiplies the runtime and splits the result three ways.
- Fixing cycles one by one with local `import type` edits while the barrel that caused them stays.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/madge.md`
- `usecases/refactor-blast-radius.md`
