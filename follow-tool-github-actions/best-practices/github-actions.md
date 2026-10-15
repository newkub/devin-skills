# GitHub Actions — Best Practices

CI/CD workflow discipline — security, caching, and maintainability

## Recommended Patterns

- Pin actions by commit SHA or full version tag (`actions/checkout@v4`) — never `@main`/branch refs in supply-chain-sensitive repos
- Minimal permissions: a `permissions:` block per job — `contents: read` default, add only what's needed
- Cache deps: `actions/setup-*` have built-in `cache:` (bun/pnpm/npm/cargo) — use them instead of manual actions/cache
- Matrix builds for OS/version coverage — `fail-fast: false` when every failure should be visible
- `concurrency` group + `cancel-in-progress` for PR workflows — don't burn runners on stale pushes

## Common Pitfalls

- Secrets in logs: auto-`mask`ed, but multiline/transformed secrets can leak — never echo secrets or run string operations on them
- `pull_request_target` is dangerous — it runs in the base repo context with secrets; never checkout PR code + run it under this trigger
- Use job outputs/`GITHUB_OUTPUT` instead of `::set-output` (deprecated)
- Reusable workflows vs composite actions — reusable = job-level isolation, composite = step bundling; choose by scope
- `if: always()` + status checks — cleanup jobs need `if: always()` or they won't run on failure

## Perf Notes

- Dependent jobs serialize — parallelize independent jobs; keep `needs` chains only where required
- `paths:`/`paths-ignore:` filters skip docs-only changes
- Self-hosted runners for heavy builds — cache persists on the machine

## Do / Don't

| Do | Don't |
|----|-------|
| pin action versions | `@main`/`@master` refs |
| least-privilege `permissions:` | default write-all token |
| `pull_request` trigger for PR code | `pull_request_target` + checkout PR |
| concurrency cancel-in-progress | queue stacked builds on stale commits |
