# cargo-nextest — Best Practices

Fast Rust test runner — process-per-test isolation and parallelism

## Recommended Patterns

- `cargo nextest run` instead of `cargo test` — process-per-test = real isolation, fail-fast, parallel-by-default
- `.config/nextest.toml` for profiles: `default` (dev), `ci` (retries, junit, slow-timeout)
- `slow-timeout`/`leak-timeout` config — tests exceeding the threshold are flagged slow, not killed immediately
- `retries` in the CI profile only for flaky-tagged tests — retrying everything masks real flakes
- `--package`/`-E` filter expressions — run only affected tests during dev

## Common Pitfalls

- Isolation differs from cargo test: every test is a process → shared mutable state (files, ports, env) between tests breaks — use `test-group` or a serial filter for resource-dependent tests
- Env vars aren't inherited like cargo test — set them via the config `[env]` section or export before the run
- Doctests don't run through nextest — a separate `cargo test --doc` is still needed in CI
- Use `--no-fail-fast` in CI to see every failure; for local dev fail-fast is better
- Partitioning (`--partition`/`--shard`) for CI matrix — split tests across runners

## CI Integration

- `--profile ci` + `--message-format libtest-json`/junit for reporters
- `cargo nextest archive` → transfer test binaries across build/test stages — build once, test everywhere
- Flaky detection: the nextest report shows retries as `FLAKY` — track them as a backlog

## Do / Don't

| Do | Don't |
|----|-------|
| Process isolation + parallel | Assume shared state across tests |
| `test-group` for port/file resource tests | Serialize the whole suite for one test |
| Retries only for tagged flakies | Blanket retries masking real bugs |
| `cargo test --doc` as a complement | Expect nextest to run doctests |
