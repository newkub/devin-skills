# Code Changes Review

## Goal

Review the code changes of a pull request before merge

## Checks

1. Run `/run-verify` to run lint, typecheck, scan — if it fails, report first before continuing
2. Run `/deep-review` on the changed files
3. Run `/deep-review` for security-sensitive changes
4. Run `/deep-review` for test coverage and test quality
5. Run `/deep-review` for docs, changelog, versioning, git hygiene
6. If the PR is frontend → run `/deep-review`
7. If the PR is backend → run `/deep-review`
8. If the PR is API → run `/deep-review`
9. If the PR is auth → run `/deep-review`

## Severity

- Critical: build fail, security risk, breaking change without migration
- High: missing tests, lint fail, unreviewed auth change
- Medium: missing docs/changelog, minor coverage drop
- Low: formatting, cosmetic
