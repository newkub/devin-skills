# Use Case — Measure The Blast Radius Before Moving A Module

> Before renaming, moving, or deleting a file, the question is not "who imports this" but "what breaks if I am wrong" — madge answers that in one command. Sources: https://github.com/pahen/madge and `madge --help` (accessed 2026-10-21)

## 1. Ask who depends on the file

```sh
bunx madge --depends src/lib/pricing.ts src/
```

`--depends` lists every file that imports the target, transitively. That list is the review scope: those are the call sites to read before changing a signature, and the tests to run afterwards.

```sh
bunx madge --depends --json src/lib/pricing.ts src/ > report/depends.json
```

For a wide module the JSON is easier to filter than scrolling the tree.

## 2. Find files nobody imports

```sh
bunx madge --orphans src/
```

An orphan is a file no other file imports. That is a deletion candidate — but only a candidate: route files, entry points, config files, and anything referenced from `package.json` scripts or tooling are all imported by nothing and still required.

## 3. Tell orphans apart from leaves

```sh
bunx madge --orphans src/
bunx madge --leaves src/
```

`--leaves` lists files that import nothing (leaf utilities); `--orphans` lists files that nothing imports. A leaf inside `src/lib/` is usually fine. A leaf that is also never imported is the file that was abandoned halfway through a refactor.

## 4. Check the graph before deleting, not after

```sh
bunx madge --orphans --ts-config tsconfig.json --extensions ts,tsx src/ > report/orphans.json
node -e "const o=require('./report/orphans.json');console.log(o.length,o.slice(0,20))"
```

Sort the list by depth: a file no one imports that is imported by three other orphans disappears as a group. Deleting the first file makes the second an orphan, so iterate until the list stops shrinking.

## 5. Re-measure after the move

```sh
bunx madge --circular --extensions ts,tsx src/
bunx madge --depends src/lib/pricing/index.ts src/
```

Moving a module changes import paths, and a path change is exactly where a new cycle appears. Re-run both: the cycle check for structure, `--depends` to confirm the new path has the same consumers as the old one.

## 6. Verify

1. Compare the dependency list before and after — the set of consumers must be identical, only their import paths change
2. Run the cycle gate again; a move that creates a cycle is a failed move
3. Run `/run-verify` for build, typecheck, and tests
4. Run `/run-test` on the touched modules
5. For a deletion, confirm the file is not referenced by `package.json` scripts, route conventions, or tool configuration

## Pitfalls

- Reading `--depends` as direct importers — it is transitive, so the list is larger than the code that needs editing.
- Deleting every orphan: route files, configs, migrations, and scripts are imported by convention, not by an `import` statement.
- Using `--leaves` as a cleanup list — most packages are supposed to contain leaves.
- Moving a file and updating only the direct importers while a barrel elsewhere still points at the old path.
- Ignoring that madge only sees static imports; a consumer reached through `import(variable)` or a bundler alias is invisible.
- Running the analysis without `--ts-config`, so aliased imports are counted as unresolved and their dependents vanish from the answer.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/madge.md`
- `usecases/circular-dependency-gate.md`
