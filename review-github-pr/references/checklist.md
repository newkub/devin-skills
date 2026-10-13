# review-github-pr — Full Dimension Checklist

## 1. Metadata

- [ ] title/description matches changes, linked issues
- [ ] PR size reviewable, scope focused
- [ ] labels, reviewers, draft status appropriate
- [ ] CI checks status, required reviews met

## 2. Code Changes

- [ ] diff review: logic, edge cases, regressions
- [ ] no unrelated changes, no debug leftovers
- [ ] tests added/updated for changes
- [ ] docs/changelog updated if user-facing

## 3. Risk And Compatibility

- [ ] breaking changes flagged, migration path
- [ ] security implications, secrets in diff
- [ ] performance impact of changes
- [ ] dependency changes reviewed

## 4. Process

- [ ] review comments addressed, unresolved threads
- [ ] commit history clean, messages match convention
- [ ] merge strategy suitable (squash/rebase/merge)
- [ ] branch up-to-date, conflicts resolved

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
