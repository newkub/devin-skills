# hk — Best Practices

Git hooks manager (replaces Lefthook/pre-commit) — fast, parallel hook discipline

## Recommended Patterns

- `hk.pkl` config — pkl-based, typed, amendable; declare hooks per event (`pre-commit`, `pre-push`, `commit-msg`)
- Stash + fix flow: `fix` jobs that modify files must re-stage — hk handles stashing automatically (an edge over lefthook here)
- Parallel by default — hk runs jobs concurrently; use `depends` only when order truly matters
- File filtering per job with `glob`/`dir` patterns — lint only the relevant staged files
- `hk run`/`hk check` for manual/CI parity — the same hooks work in CI

## Common Pitfalls

- Pre-commit hooks must be fast (<5s total) — move heavy work (test suites) to `pre-push` or CI
- Jobs that edit files (formatters) must be `fix` type, not `check` — check doesn't re-stage
- Bootstrap: team members must run `hk install` — put it in setup docs/postinstall script
- Secrets scanning hook — don't rely on the hook alone; hooks are bypassable with `--no-verify`, CI must have a repeating gate

## Perf Notes

- Use built-in fast tools (`check` steps call binaries directly) — wrapping through a task runner adds latency
- Group related checks in one job when cheap — there's per-job spawn overhead

## Do / Don't

| Do | Don't |
|----|-------|
| fast checks in pre-commit | test suites in pre-commit |
| `fix` type for formatters | `check` that modifies files |
| CI gate repeating the hooks | trusting hooks alone (--no-verify) |
| `hk install` in onboarding docs | assume hooks are active automatically |
