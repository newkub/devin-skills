# cargo-mutants — Best Practices

Mutation testing for Rust — measures the real quality of a test suite

## Recommended Patterns

- `cargo mutants` at the crate root — mutants = code variants that should make tests fail; a survivor = a test gap
- Scope with `-f`/`--file` globs — full-crate runs are very slow; target only critical modules (business logic, parsers)
- Run in CI as a scheduled/weekly job — not every PR (too long); scope per-PR to changed files
- `--baseline ref` incremental mode — mutants only for changed code
- Iterate: surviving mutant → write an added test → re-run just that file

## Common Pitfalls

- Timeout mutants (infinite loops) — use `--timeout` + `--jobs` parallel; hangs are the cost of mutation testing
- False survivors: `#[derive]` code, logging, formatting-only mutations — `--exclude`/skip annotations for untestable paths
- Mutation score is not the goal — 100% is impractical; focus on critical-path mutants
- Debug asserts: mutant tests must run release-ish behavior — `--test-tool nextest` is much faster than cargo test
- Compile time dominates — incremental + parallel jobs + sccache

## Interpretation

- Caught mutant = good test suite; Survived = missing assertion/coverage; Timeout/Unviable = analyze separately
- Report as a gap list, not a single score — surviving mutants are the test-writing backlog

## Do / Don't

| Do | Don't |
|----|-------|
| Scope changed files / critical modules | Full-crate mutants on every PR |
| `--test-tool nextest` | Default cargo test (slow) |
| Survivors → test backlog | Chase a 100% mutation score |
| Exclude untestable paths | Fight logging/format mutants |
