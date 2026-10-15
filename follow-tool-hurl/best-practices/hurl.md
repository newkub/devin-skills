# Hurl — Best Practices

Plain-text HTTP testing — requests, assertions, and chaining

## Recommended Patterns

- `.hurl` files = request + assertions in one file — `[QueryStringParams]`, `[FormParams]`, `[Captures]`, `[Asserts]` sections
- Chain requests with captures: `token: jsonpath "$.token"` then use `{{token}}` in the next request — auth flows for test suites
- `hurl --variables-file vars.env` or `--variable` for env switching — never hardcode hosts/credentials
- Assert status + body + headers + duration together — `jsonpath`/`xpath`/`regex` predicates per content type
- Test suites = directories of `.hurl` files — `hurl --test dir/` runs them all

## Common Pitfalls

- Secrets in .hurl files = committed leaks — always variables-file + `.gitignore`
- Retry/flaky endpoints: `--retry` + `--retry-interval` — never retry assertions that mutate state (POST isn't idempotent)
- `body` asserts are brittle on dynamic fields — assert structure (jsonpath exists/type) rather than exact values
- Cookies/session: `[Options]` `cookie` handling — Hurl doesn't share a cookie jar across files by default
- Use `--error-format long` when debugging — default output is terse

## CI Integration

- `hurl --test --report-junit out.xml` for CI reporting
- `--jobs 1` when tests are sequential-dependent (chains within one file are already sequential; files run in parallel)
- Rate-limited APIs: beware `--repeat` + delays vs quota

## Do / Don't

| Do | Don't |
|----|-------|
| captures → chained requests | hand-copied tokens |
| variables-file per env | hardcode hosts/secrets |
| assert structure + status | exact-body asserts on dynamic data |
| `--test` + junit report in CI | ad-hoc curl in pipelines |
