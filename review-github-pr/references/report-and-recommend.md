# Report And Recommend

## Goal

Build the report and recommend actions for the pull request

## Checks

1. Run `/report` with `/report table`
2. Build the PR Checklist table: Title, Description, Size, Conflicts, Conventional Commits, Tests, CI
3. Build the Findings table: Category, Severity, Location, Recommendation
4. State merge readiness: ready, needs changes, needs discussion
5. Run `/suggest-next-action`

## Severity

- Critical: merge blocked because of CI fail or security risk
- High: changes required before merge
- Medium: needs discussion
- Low: cosmetic, nit
